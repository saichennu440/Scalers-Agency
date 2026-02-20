import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ClientContent } from '../../lib/types';
import { Edit2, Trash2, Star, Image, Play, FileText, AlertTriangle } from 'lucide-react';

interface ContentListProps {
  items: ClientContent[];
  onEdit: (item: ClientContent) => void;
  onRefresh: () => void;
}

const typeIcons = {
  image: Image,
  video: Play,
  text: FileText,
};

export default function ContentList({ items, onEdit, onRefresh }: ContentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from('client_content').delete().eq('id', id);
      if (!error) onRefresh();
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-sm border border-gray-200">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <FileText size={20} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No content added yet.</p>
        <p className="text-gray-400 text-xs mt-1">Click "Add Content" to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-sm border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wide uppercase">Content</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wide uppercase hidden md:table-cell">Client</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wide uppercase hidden lg:table-cell">Category</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 tracking-wide uppercase hidden sm:table-cell">Featured</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 tracking-wide uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const TypeIcon = typeIcons[item.content_type];
            return (
              <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-red-50 flex items-center justify-center shrink-0">
                      <TypeIcon size={14} className="text-[#C8102E]" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm line-clamp-1">{item.title}</div>
                      <div className="text-xs text-gray-400 capitalize">{item.content_type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{item.client_name || '-'}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {item.category ? (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-sm">{item.category}</span>
                  ) : '-'}
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {item.is_featured && <Star size={14} className="text-amber-400 fill-amber-400 mx-auto" />}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {confirmId === item.id ? (
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700 disabled:opacity-60"
                        >
                          {deletingId === item.id ? '...' : 'Delete'}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-[#C8102E] hover:bg-red-50 rounded-sm transition-colors duration-200"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmId(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
