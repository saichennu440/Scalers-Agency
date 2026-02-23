import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ClientContent } from '../../lib/types';
import { Save, X, Upload, Link, Loader2, Image as ImageIcon, Film, CheckCircle2, ChevronDown } from 'lucide-react';

type ContentType = 'reels' | 'videos' | 'creatives';

const CONTENT_TYPE_CONFIG: Record<ContentType, {
  label: string; mediaKind: 'video' | 'image'; accept: string; hint: string;
}> = {
  reels:     { label: 'Reels',     mediaKind: 'video', accept: 'video/*', hint: 'MP4, WebM, MOV — max 200MB' },
  videos:    { label: 'Videos',    mediaKind: 'video', accept: 'video/*', hint: 'MP4, WebM, MOV — max 200MB' },
  creatives: { label: 'Creatives', mediaKind: 'image', accept: 'image/*', hint: 'JPG, PNG, GIF, WebP — max 50MB' },
};

interface ContentFormProps {
  initial?: Partial<ClientContent>;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm = {
  title: '',
  description: '',
  content_type: 'creatives' as ContentType,
  content_url: '',
  content_text: '',
  client_name: '',
  client_logo_url: '',
  category: '',
  is_featured: false,
  display_order: 0,
};

type InputMode = 'upload' | 'url';

export default function ContentForm({ initial, onSuccess, onCancel }: ContentFormProps) {
  const [form,            setForm]            = useState({ ...emptyForm, ...(initial as any) });
  const [saving,          setSaving]          = useState(false);
  const [error,           setError]           = useState('');

  // ── categories from DB ──
  const [categories, setCategories] = useState<string[]>([]);

  // ── Main media ──
  const [inputMode,        setInputMode]        = useState<InputMode>(initial?.content_url ? 'url' : 'upload');
  const [uploading,        setUploading]        = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Client logo ──
  const [logoMode,      setLogoMode]      = useState<InputMode>(initial?.client_logo_url ? 'url' : 'upload');
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoFileName,  setLogoFileName]  = useState('');
  const [logoPreview,   setLogoPreview]   = useState<string>((initial as any)?.client_logo_url || '');
  const logoInputRef = useRef<HTMLInputElement>(null);

  // URL preview (image only)
  const [urlPreview, setUrlPreview] = useState<string>(
    initial?.content_url && !['reels', 'videos'].includes((initial as any)?.content_type ?? '')
      ? (initial.content_url as string)
      : ''
  );

  const typeConfig = CONTENT_TYPE_CONFIG[form.content_type as ContentType] ?? CONTENT_TYPE_CONFIG.creatives;
  const isVideo    = typeConfig.mediaKind === 'video';
  const isImage    = typeConfig.mediaKind === 'image';
  const hasUpload  = !!uploadedFileName;

  /* ── Load categories from DB ── */
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('categories')
        .select('name')
        .order('created_at', { ascending: true });
      if (data) setCategories(data.map(d => d.name));
    };
    load();

    // Realtime: update dropdown when admin adds/deletes a category
    const ch = supabase
      .channel('form-categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  /* ── Field change ── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'content_type') {
      setForm((prev: any) => ({ ...prev, content_type: value as ContentType, content_url: '' }));
      setUploadedFileName('');
      setUrlPreview('');
      return;
    }
    setForm((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  /* ── Upload main media ── */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cfg = CONTENT_TYPE_CONFIG[form.content_type as ContentType];
    if (cfg.mediaKind === 'video' && !file.type.startsWith('video/')) {
      setError('Please select a video file (MP4, WebM, MOV)'); return;
    }
    if (cfg.mediaKind === 'image' && !file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, GIF, WebP)'); return;
    }

    const maxSize = cfg.mediaKind === 'video' ? 200 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File must be under ${cfg.mediaKind === 'video' ? '200' : '50'}MB`); return;
    }

    setError('');
    setUploading(true);
    setUploadedFileName('');

    try {
      const ext      = file.name.split('.').pop();
      const fileName = `${form.content_type}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('client-content')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('client-content').getPublicUrl(fileName);
      setForm((prev: any) => ({ ...prev, content_url: urlData.publicUrl }));
      setUploadedFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  /* ── Upload logo ── */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) { setError('Logo must be an image file'); return; }
    if (file.size > 5 * 1024 * 1024)    { setError('Logo must be under 5MB');       return; }

    setError('');
    setLogoUploading(true);
    setLogoFileName('');

    try {
      const ext      = file.name.split('.').pop();
      const fileName = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('client-content')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('client-content').getPublicUrl(fileName);
      setForm((prev: any) => ({ ...prev, client_logo_url: urlData.publicUrl }));
      setLogoFileName(file.name);
      setLogoPreview(urlData.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logo upload failed. Please try again.');
    } finally {
      setLogoUploading(false);
    }
  };

  /* ── URL mode ── */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setForm((prev: any) => ({ ...prev, content_url: url }));
    setUrlPreview(url);
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim())       { setError('Title is required');                   return; }
    if (!form.content_url.trim()) { setError('Please upload a file or enter a URL'); return; }

    setSaving(true);
    try {
      const payload = {
        title:           form.title,
        description:     form.description,
        content_type:    form.content_type,
        content_url:     form.content_url,
        content_text:    form.content_text,
        client_name:     form.client_name,
        client_logo_url: form.client_logo_url,
        category:        form.category,
        is_featured:     form.is_featured,
        display_order:   Number(form.display_order),
      };

      if ((initial as any)?.id) {
        const { error: err } = await supabase.from('client_content').update(payload).eq('id', (initial as any).id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('client_content').insert(payload);
        if (err) throw err;
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = 'w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#C8102E] transition-colors duration-200 bg-white';
  const labelClass = 'block text-xs font-semibold text-gray-600 tracking-wide uppercase mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-gray-200 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-gray-900">
          {(initial as any)?.id ? 'Edit Content' : 'Add New Content'}
        </h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Title */}
        <div className="md:col-span-2">
          <label className={labelClass}>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className={fieldClass} placeholder="Content title" />
        </div>

        {/* Content Type */}
        <div>
          <label className={labelClass}>Content Type *</label>
          <select name="content_type" value={form.content_type} onChange={handleChange} className={fieldClass}>
            <option value="reels">Reels (short vertical video)</option>
            <option value="videos">Videos (longer / landscape)</option>
            <option value="creatives">Creatives (image / poster)</option>
          </select>
        </div>

        {/* ── Category — dropdown from DB ── */}
        <div>
          <label className={labelClass}>Category</label>
          <div className="relative">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`${fieldClass} appearance-none pr-9 cursor-pointer`}
            >
              <option value="">— Select a category —</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {categories.length === 0 && (
                <option disabled value="">No categories yet — add one above</option>
              )}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {categories.length === 0 && (
            <p className="text-[11px] text-amber-600 mt-1">
              ⚠ No categories found. Use the <strong>Add Category</strong> button first.
            </p>
          )}
        </div>

        {/* ── Media upload / URL ── */}
        <div className="md:col-span-2">
          <label className={labelClass}>{typeConfig.label} File *</label>

          {/* Toggle */}
          <div className="flex rounded-sm border border-gray-200 overflow-hidden mb-3 w-fit">
            <button
              type="button"
              onClick={() => { setInputMode('upload'); setUrlPreview(''); }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors ${inputMode === 'upload' ? 'bg-[#C8102E] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Upload size={12} /> Upload from Device
            </button>
            <button
              type="button"
              onClick={() => { setInputMode('url'); setUploadedFileName(''); }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors ${inputMode === 'url' ? 'bg-[#C8102E] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Link size={12} /> Enter URL
            </button>
          </div>

          {/* Upload dropzone */}
          {inputMode === 'upload' && (
            <>
              <input ref={fileInputRef} type="file" accept={typeConfig.accept} onChange={handleFileUpload} className="hidden" />
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors cursor-pointer ${
                  uploading ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-200 hover:border-[#C8102E] hover:bg-red-50/20'
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={28} className="text-[#C8102E] animate-spin" />
                    <p className="text-sm text-gray-500">Uploading…</p>
                    <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C8102E] animate-pulse w-3/4" />
                    </div>
                  </div>
                ) : hasUpload ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 size={28} className="text-green-500" />
                    <p className="text-sm font-semibold text-green-600">
                      {isVideo ? 'Video' : 'Image'} uploaded successfully!
                    </p>
                    <p className="text-xs text-gray-400 max-w-xs truncate">{uploadedFileName}</p>
                    {isImage && form.content_url && (
                      <img src={form.content_url} alt="Preview"
                        className="mt-2 max-h-36 max-w-xs rounded object-contain border border-gray-200" />
                    )}
                    <button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="mt-1 text-xs text-[#C8102E] underline">Replace file</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    {isVideo ? <Film size={28} className="text-gray-300" /> : <ImageIcon size={28} className="text-gray-300" />}
                    <p className="text-sm font-semibold text-gray-500">Click to upload {isVideo ? 'a video' : 'an image'}</p>
                    <p className="text-xs text-gray-400">{typeConfig.hint}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* URL mode */}
          {inputMode === 'url' && (
            <>
              <input
                value={form.content_url}
                onChange={handleUrlChange}
                className={fieldClass}
                placeholder={isVideo ? 'https://youtube.com/... or direct .mp4 URL' : 'https://example.com/image.jpg'}
              />
              {urlPreview && isImage && (
                <div className="mt-3 rounded-sm overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={urlPreview} alt="Preview" className="max-h-48 w-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              {urlPreview && isVideo && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-sm">
                  <Film size={16} className="text-blue-400 shrink-0" />
                  <p className="text-xs text-blue-600">
                    Video URL saved. Preview not shown in admin — it will play correctly on the client page.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className={`${fieldClass} resize-none`} placeholder="Brief description or caption…" />
        </div>

        {/* Client Name */}
        <div>
          <label className={labelClass}>Client Name</label>
          <input name="client_name" value={form.client_name} onChange={handleChange} className={fieldClass} placeholder="Client company name" />
        </div>

        {/* ── Client Logo ── */}
        <div>
          <label className={labelClass}>Client Logo</label>
          <div className="flex rounded-sm border border-gray-200 overflow-hidden mb-2 w-fit">
            <button type="button" onClick={() => setLogoMode('upload')}
              className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold transition-colors ${logoMode === 'upload' ? 'bg-[#C8102E] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Upload size={10} /> Upload
            </button>
            <button type="button" onClick={() => setLogoMode('url')}
              className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold transition-colors ${logoMode === 'url' ? 'bg-[#C8102E] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Link size={10} /> URL
            </button>
          </div>

          {logoMode === 'upload' && (
            <>
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <div
                onClick={() => !logoUploading && logoInputRef.current?.click()}
                className={`border border-dashed rounded-sm p-4 text-center cursor-pointer transition-colors ${
                  logoUploading ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-200 hover:border-[#C8102E] hover:bg-red-50/20'
                }`}
              >
                {logoUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="text-[#C8102E] animate-spin" />
                    <span className="text-xs text-gray-500">Uploading logo…</span>
                  </div>
                ) : logoPreview ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <img src={logoPreview} alt="Logo" className="h-10 object-contain rounded" />
                    <p className="text-[11px] text-green-600 font-medium">{logoFileName || 'Logo uploaded'}</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); logoInputRef.current?.click(); }}
                      className="text-[11px] text-[#C8102E] underline">Replace</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon size={18} className="text-gray-300" />
                    <p className="text-xs text-gray-500">Click to upload logo</p>
                    <p className="text-[11px] text-gray-400">PNG, SVG, JPG — max 5MB</p>
                  </div>
                )}
              </div>
            </>
          )}

          {logoMode === 'url' && (
            <div>
              <input
                name="client_logo_url"
                value={form.client_logo_url}
                onChange={(e) => {
                  setForm((prev: any) => ({ ...prev, client_logo_url: e.target.value }));
                  setLogoPreview(e.target.value);
                }}
                className={fieldClass}
                placeholder="https://…"
              />
              {logoPreview && (
                <img src={logoPreview} alt="Logo preview"
                  className="mt-2 h-10 object-contain rounded border border-gray-200 bg-gray-50 px-2"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
            </div>
          )}
        </div>

        {/* Display Order */}
        <div>
          <label className={labelClass}>Display Order</label>
          <input name="display_order" type="number" value={form.display_order} onChange={handleChange} className={fieldClass} min={0} />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3 pt-6">
          <input type="checkbox" id="is_featured" name="is_featured" checked={form.is_featured}
            onChange={handleChange} className="w-4 h-4 accent-[#C8102E]" />
          <label htmlFor="is_featured" className="text-sm text-gray-700 font-medium">Mark as Featured</label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-sm hover:border-gray-300 transition-colors duration-200">
          Cancel
        </button>
        <button type="submit" disabled={saving || uploading || logoUploading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#C8102E] text-white text-sm font-semibold rounded-sm hover:bg-[#a50d25] disabled:opacity-60 transition-colors duration-200">
          <Save size={14} />
          {saving ? 'Saving…' : (initial as any)?.id ? 'Update Content' : 'Add Content'}
        </button>
      </div>
    </form>
  );
}