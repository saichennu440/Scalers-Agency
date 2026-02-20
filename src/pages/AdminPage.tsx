import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ClientContent } from '../lib/types';
import ContentForm from '../components/admin/ContentForm';
import ContentList from '../components/admin/ContentList';
import { Plus, LogOut, LayoutDashboard, FileText, Image, Play, Star, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [session, setSession] = useState<{ user: { email?: string } } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const [items, setItems] = useState<ClientContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ClientContent | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) fetchContent();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchContent();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('client_content')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setSigningIn(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setItems([]);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditItem(null);
    fetchContent();
  };

  const handleEdit = (item: ClientContent) => {
    setEditItem(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center pt-20 px-4">
        <div className="bg-white w-full max-w-md rounded-sm shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10 mb-3">
              <polygon points="16,2 28,26 4,26" fill="#C8102E" />
              <polygon points="16,10 24,26 8,26" fill="#E85555" opacity="0.7" />
            </svg>
            <h1 className="text-2xl font-black text-gray-900">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to manage client content</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 tracking-wide uppercase mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
                placeholder="admin@scalers.agency"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 tracking-wide uppercase mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={signingIn}
              className="w-full py-3 bg-[#C8102E] text-white font-semibold text-sm tracking-wide uppercase rounded-sm hover:bg-[#a50d25] disabled:opacity-60 transition-colors duration-200 mt-2"
            >
              {signingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Content', value: items.length, Icon: LayoutDashboard },
    { label: 'Images', value: items.filter((i) => i.content_type === 'image').length, Icon: Image },
    { label: 'Videos', value: items.filter((i) => i.content_type === 'video').length, Icon: Play },
    { label: 'Text Posts', value: items.filter((i) => i.content_type === 'text').length, Icon: FileText },
    { label: 'Featured', value: items.filter((i) => i.is_featured).length, Icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Content Dashboard</h1>
            <p className="text-gray-500 text-xs mt-0.5">Logged in as <span className="font-medium text-gray-700">{session.user.email}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchContent}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-sm hover:border-gray-300 transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {stats.map(({ label, value, Icon }) => (
            <div key={label} className="bg-white rounded-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">{label}</span>
                <Icon size={14} className="text-[#C8102E]" />
              </div>
              <div className="text-3xl font-black text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        {showForm ? (
          <div className="mb-8">
            <ContentForm
              initial={editItem ?? undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => { setShowForm(false); setEditItem(null); }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-gray-900">All Content</h2>
            <button
              onClick={() => { setEditItem(null); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C8102E] text-white text-sm font-semibold rounded-sm hover:bg-[#a50d25] transition-colors"
            >
              <Plus size={16} />
              Add Content
            </button>
          </div>
        )}

        {!showForm && (
          <ContentList
            items={items}
            onEdit={handleEdit}
            onRefresh={fetchContent}
          />
        )}
      </div>
    </div>
  );
}
