import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { ClientContent, ContentType } from '../../lib/types';
import { Save, X, Upload, Link, Loader2, Image as ImageIcon, Film } from 'lucide-react';

interface ContentFormProps {
  initial?: Partial<ClientContent>;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm = {
  title: '',
  description: '',
  content_type: 'image' as ContentType,
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
  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>(initial?.content_url ? 'url' : 'upload');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>(initial?.content_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear content_url when type changes
    if (name === 'content_type') {
      setForm((prev) => ({ ...prev, content_type: value as ContentType, content_url: '' }));
      setPreviewUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (form.content_type === 'image' && !isImage) {
      setError('Please select an image file (JPG, PNG, GIF, WebP, etc.)');
      return;
    }
    if (form.content_type === 'video' && !isVideo) {
      setError('Please select a video file (MP4, WebM, MOV, etc.)');
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be under 50MB');
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      // Create unique filename
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const filePath = `${form.content_type}s/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('client-content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('client-content')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      setForm((prev) => ({ ...prev, content_url: publicUrl }));
      setPreviewUrl(publicUrl);
      setUploadProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setForm((prev) => ({ ...prev, content_url: url }));
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required'); return; }
    if ((form.content_type === 'image' || form.content_type === 'video') && !form.content_url.trim()) {
      setError(`Please upload a file or enter a ${form.content_type} URL`);
      return;
    }
    if (form.content_type === 'text' && !form.content_text.trim()) {
      setError('Text content is required for text type');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        content_type: form.content_type,
        content_url: form.content_url,
        content_text: form.content_text,
        client_name: form.client_name,
        client_logo_url: form.client_logo_url,
        category: form.category,
        is_featured: form.is_featured,
        display_order: Number(form.display_order),
      };

      if (initial?.id) {
        const { error: err } = await supabase.from('client_content').update(payload).eq('id', initial.id);
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

  const showMediaInput = form.content_type === 'image' || form.content_type === 'video';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-gray-900">
          {initial?.id ? 'Edit Content' : 'Add New Content'}
        </h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm">
          {error}
        </div>
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
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category</label>
          <input name="category" value={form.category} onChange={handleChange} className={fieldClass} placeholder="e.g. Branding, Marketing" />
        </div>

        {/* Image / Video Input */}
        {showMediaInput && (
          <div className="md:col-span-2">
            <label className={labelClass}>
              {form.content_type === 'image' ? 'Image' : 'Video'} *
            </label>

            {/* Toggle: Upload vs URL */}
            <div className="flex rounded-sm border border-gray-200 overflow-hidden mb-3 w-fit">
              <button
                type="button"
                onClick={() => { setInputMode('upload'); }}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors ${
                  inputMode === 'upload' ? 'bg-[#C8102E] text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Upload size={12} />
                Upload from Device
              </button>
              <button
                type="button"
                onClick={() => { setInputMode('url'); }}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors ${
                  inputMode === 'url' ? 'bg-[#C8102E] text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Link size={12} />
                Enter URL
              </button>
            </div>

            {/* Upload Mode */}
            {inputMode === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={form.content_type === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors cursor-pointer ${
                    uploading ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-200 hover:border-[#C8102E] hover:bg-red-50/30'
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={28} className="text-[#C8102E] animate-spin" />
                      <p className="text-sm text-gray-500">Uploading...</p>
                      <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C8102E] transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : form.content_url && inputMode === 'upload' ? (
                    <div className="flex flex-col items-center gap-2">
                      {form.content_type === 'image' ? (
                        <ImageIcon size={24} className="text-green-500" />
                      ) : (
                        <Film size={24} className="text-green-500" />
                      )}
                      <p className="text-sm text-green-600 font-medium">File uploaded successfully!</p>
                      <p className="text-xs text-gray-400 break-all max-w-sm">{form.content_url.split('/').pop()}</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="mt-1 text-xs text-[#C8102E] underline"
                      >
                        Replace file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {form.content_type === 'image' ? (
                        <ImageIcon size={28} className="text-gray-300" />
                      ) : (
                        <Film size={28} className="text-gray-300" />
                      )}
                      <p className="text-sm font-semibold text-gray-500">
                        Click to upload {form.content_type === 'image' ? 'an image' : 'a video'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {form.content_type === 'image'
                          ? 'JPG, PNG, GIF, WebP — max 50MB'
                          : 'MP4, WebM, MOV — max 50MB'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* URL Mode */}
            {inputMode === 'url' && (
              <input
                value={form.content_url}
                onChange={handleUrlChange}
                className={fieldClass}
                placeholder={
                  form.content_type === 'image'
                    ? 'https://example.com/image.jpg'
                    : 'https://example.com/video.mp4 (direct MP4 URL)'
                }
              />
            )}

            {/* Preview */}
            {previewUrl && (
              <div className="mt-3 rounded-sm overflow-hidden border border-gray-200 bg-gray-50">
                {form.content_type === 'image' ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 w-full object-contain"
                    onError={() => setError('Could not load image preview — check the URL')}
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-48 w-full"
                    onError={() => setError('Could not load video preview — check the URL or file')}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </div>
        )}

        {/* Text Content */}
        {form.content_type === 'text' && (
          <div className="md:col-span-2">
            <label className={labelClass}>Text Content *</label>
            <textarea
              name="content_text"
              value={form.content_text}
              onChange={handleChange}
              rows={6}
              className={`${fieldClass} resize-y`}
              placeholder="Write your content here..."
            />
          </div>
        )}

        {/* Description */}
        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={`${fieldClass} resize-none`}
            placeholder="Brief description or caption..."
          />
        </div>

        {/* Client Name */}
        <div>
          <label className={labelClass}>Client Name</label>
          <input name="client_name" value={form.client_name} onChange={handleChange} className={fieldClass} placeholder="Client company name" />
        </div>

        {/* Client Logo */}
        <div>
          <label className={labelClass}>Client Logo URL</label>
          <input name="client_logo_url" value={form.client_logo_url} onChange={handleChange} className={fieldClass} placeholder="https://..." />
        </div>

        {/* Display Order */}
        <div>
          <label className={labelClass}>Display Order</label>
          <input name="display_order" type="number" value={form.display_order} onChange={handleChange} className={fieldClass} min={0} />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            id="is_featured"
            name="is_featured"
            checked={form.is_featured}
            onChange={handleChange}
            className="w-4 h-4 accent-[#C8102E]"
          />
          <label htmlFor="is_featured" className="text-sm text-gray-700 font-medium">Mark as Featured</label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-sm hover:border-gray-300 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#C8102E] text-white text-sm font-semibold rounded-sm hover:bg-[#a50d25] disabled:opacity-60 transition-colors duration-200"
        >
          <Save size={14} />
          {saving ? 'Saving...' : initial?.id ? 'Update Content' : 'Add Content'}
        </button>
      </div>
    </form>
  );
}