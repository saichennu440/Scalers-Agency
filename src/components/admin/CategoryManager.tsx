import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, X, Loader2, Tag, Trash2, AlertTriangle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  created_at: string;
}

interface CategoryManagerProps {
  onCategoriesChange?: () => void; // optional callback to notify parent
}

export default function CategoryManager({ onCategoriesChange }: CategoryManagerProps) {
  const [categories,   setCategories]   = useState<Category[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [showInput,    setShowInput]    = useState(false);
  const [inputValue,   setInputValue]   = useState('');
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState('');
  const [confirmId,    setConfirmId]    = useState<string | null>(null);
  const [deletingId,   setDeletingId]   = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();

    // Realtime subscription — update list when any client adds/deletes a category
    const ch = supabase
      .channel('categories-manager')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchCategories)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    setCategories(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    const name = inputValue.trim();
    if (!name) { setError('Category name cannot be empty'); return; }
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      setError('This category already exists');
      return;
    }

    setError('');
    setSaving(true);
    try {
      const { error: err } = await supabase
        .from('categories')
        .insert({ name });
      if (err) throw err;
      setInputValue('');
      setShowInput(false);
      onCategoriesChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error: err } = await supabase.from('categories').delete().eq('id', id);
      if (err) throw err;
      setConfirmId(null);
      onCategoriesChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    setShowInput(false);
    setInputValue('');
    setError('');
  };

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag size={15} className="text-[#C8102E]" />
          <h4 className="text-sm font-bold text-gray-800">Categories</h4>
          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[11px] font-semibold">
            {categories.length}
          </span>
        </div>
        {!showInput && (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C8102E] text-white text-xs font-semibold rounded-sm hover:bg-[#a50d25] transition-colors"
          >
            <Plus size={13} />
            Add Category
          </button>
        )}
      </div>

      {/* Inline add input */}
      {showInput && (
        <div className="mb-4 p-3 bg-gray-50 rounded-sm border border-gray-200">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">New Category Name</p>
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={e => { setInputValue(e.target.value); setError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
              placeholder="e.g. Branding, Marketing, Social Media…"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#C8102E] bg-white transition-colors"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8102E] text-white text-xs font-semibold rounded-sm hover:bg-[#a50d25] disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : null}
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-2 border border-gray-200 text-gray-500 text-xs font-semibold rounded-sm hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-[11px] mt-1.5 flex items-center gap-1">
              <AlertTriangle size={11} /> {error}
            </p>
          )}
          <p className="text-gray-400 text-[11px] mt-1.5">Press Enter to save, Esc to cancel</p>
        </div>
      )}

      {/* Category list */}
      {loading ? (
        <div className="flex items-center gap-2 py-3 text-gray-400 text-sm">
          <Loader2 size={14} className="animate-spin" /> Loading…
        </div>
      ) : categories.length === 0 ? (
        <p className="text-gray-400 text-sm py-3 text-center">
          No categories yet. Click <span className="font-semibold text-[#C8102E]">Add Category</span> to create one.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:border-[#C8102E]/30 hover:bg-red-50/30 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] opacity-60" />
              <span className="text-xs font-semibold text-gray-700 capitalize">{cat.name}</span>

              {/* Delete confirm inline */}
              {confirmId === cat.id ? (
                <div className="flex items-center gap-1 ml-1">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deletingId === cat.id}
                    className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors"
                  >
                    {deletingId === cat.id ? '…' : 'Yes'}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="text-[10px] px-2 py-0.5 rounded bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300 transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(cat.id)}
                  className="ml-0.5 p-0.5 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete category"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}