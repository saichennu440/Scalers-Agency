// AdminPage.tsx — paste this whole file (CategoryManager is already imported)
// If your AdminPage has more sections, just add CategoryManager where shown below.

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ClientContent } from '../lib/types';
import ContentForm from '../components/admin/ContentForm';
import ContentList from '../components/admin/ContentList';
import CategoryManager from '../components/admin/CategoryManager'; // ← NEW IMPORT
import { Plus, LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminPage() {
  const [items,      setItems]      = useState<ClientContent[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editItem,   setEditItem]   = useState<ClientContent | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('client_content')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const handleEdit = (item: ClientContent) => {
    setEditItem(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditItem(null);
    fetchItems();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Admin top bar ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LayoutDashboard size={18} className="text-[#C8102E]" />
          <h1 className="text-base font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* ══════════════════════════════════════════
            CATEGORY MANAGER  ← Add this block
        ══════════════════════════════════════════ */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-3">
            Manage Categories
          </h2>
          {/*
            CategoryManager:
            - Shows all categories as pills
            - "Add Category" button → inline text input → save to Supabase categories table
            - Hover a pill → × trash icon → confirm inline → delete
            - Realtime: Header dropdown + ContentForm dropdown update instantly
          */}
          <CategoryManager />
        </section>

        {/* ══════════════════════════════════════════
            CONTENT FORM (Add / Edit)
        ══════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
              {showForm ? (editItem ? 'Edit Content' : 'New Content') : 'Content Library'}
            </h2>
            {!showForm && (
              <button
                onClick={() => { setEditItem(null); setShowForm(true); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#C8102E] text-white text-xs font-semibold rounded-sm hover:bg-[#a50d25] transition-colors"
              >
                <Plus size={14} />
                Add Content
              </button>
            )}
          </div>

          {showForm && (
            <ContentForm
              initial={editItem ?? undefined}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          )}
        </section>

        {/* ══════════════════════════════════════════
            CONTENT LIST
        ══════════════════════════════════════════ */}
        {!showForm && (
          <section>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-[#C8102E] rounded-full animate-spin" />
              </div>
            ) : (
              <ContentList
                items={items}
                onEdit={handleEdit}
                onRefresh={fetchItems}
              />
            )}
          </section>
        )}

      </div>
    </div>
  );
}