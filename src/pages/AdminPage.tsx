import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ClientContent } from '../lib/types';
import ContentForm from '../components/admin/ContentForm';
import ContentList from '../components/admin/ContentList';
import CategoryManager from '../components/admin/CategoryManager';
import {
  Plus, LogOut, LayoutDashboard, Lock, Mail,
  Eye, EyeOff, Loader2, AlertCircle, ShieldCheck,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

/* ══════════════════════════════════════════════════════════════
   LOGIN SCREEN
══════════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim())    { setError('Email is required.');    return; }
    if (!password.trim()) { setError('Password is required.'); return; }

    setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authErr) throw authErr;
      if (data.user) onLogin(data.user);
    } catch (err: any) {
      setError(err.message ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    'w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#C8102E] transition-colors duration-200 bg-white';
  const labelClass =
    'block text-xs font-semibold text-gray-600 tracking-wide uppercase mb-1.5';

  return (
    /* Full-screen overlay — sits above the site header (z-[100]) */
    <div className="fixed inset-0 z-[100] bg-gray-50 flex items-center justify-center px-4 overflow-auto">
      <div className="w-full max-w-sm">

        {/* Page title */}
        <div className="flex items-center gap-2.5 mb-6">
          <LayoutDashboard size={18} className="text-[#C8102E]" />
          <h1 className="text-base font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
        </div>

        {/* Card — matches ContentForm style exactly */}
        <div className="bg-white rounded-sm border border-gray-200 p-6">

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-gray-900">Sign In</h3>
            <div className="w-8 h-8 rounded-sm bg-[#C8102E]/8 flex items-center justify-center">
              <Lock size={14} className="text-[#C8102E]" />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5">

              {/* Email */}
              <div>
                <label className={labelClass}>Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    className={`${fieldClass} pl-9`}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    className={`${fieldClass} pl-9 pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer — same as ContentForm action row */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#C8102E] text-white text-sm font-semibold rounded-sm hover:bg-[#a50d25] disabled:opacity-60 transition-colors duration-200"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          Only authorised admin accounts can log in.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD — shown after login
══════════════════════════════════════════════════════════════ */
function Dashboard({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [items,      setItems]      = useState<ClientContent[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editItem,   setEditItem]   = useState<ClientContent | null>(null);
  const [signingOut, setSigningOut] = useState(false);

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

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    onSignOut();
  };

  return (
    /*
      fixed inset-0 z-[100] — completely covers the site header and
      everything beneath it, so admin UI is fully isolated.
      overflow-y-auto — the inner content can scroll normally.
    */
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 px-6 h-[60px] flex items-center justify-between shrink-0">

        <div className="flex items-center gap-2.5">
          <LayoutDashboard size={17} className="text-[#C8102E]" />
          <h1 className="text-sm font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Logged-in badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-gray-200 bg-gray-50">
            <ShieldCheck size={13} className="text-[#C8102E]" />
            <span className="text-gray-600 text-xs font-semibold truncate max-w-[200px]">
              {user.email}
            </span>
          </div>

          {/* Sign Out button — same secondary-button style as ContentForm Cancel */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-sm hover:border-red-200 hover:text-red-600 hover:bg-red-50/40 disabled:opacity-50 transition-colors duration-200"
          >
            {signingOut
              ? <Loader2 size={13} className="animate-spin" />
              : <LogOut size={13} />
            }
            <span className="hidden sm:inline">
              {signingOut ? 'Signing out…' : 'Sign Out'}
            </span>
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

          {/* Categories */}
          <section>
            <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-3">
              Manage Categories
            </h2>
            <CategoryManager />
          </section>

          {/* Content library header + form */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
                {showForm ? (editItem ? 'Edit Content' : 'New Content') : 'Content Library'}
              </h2>
              {!showForm && (
                <button
                  onClick={() => { setEditItem(null); setShowForm(true); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#C8102E] text-white text-xs font-semibold rounded-sm hover:bg-[#a50d25] transition-colors duration-200"
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
                onCancel={() => { setShowForm(false); setEditItem(null); }}
              />
            )}
          </section>

          {/* Content list */}
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
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT — resolves session → shows Login or Dashboard
══════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [user,        setUser]        = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Restore existing session on page refresh
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });

    // Stay in sync across tabs
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Session check
  if (authLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#C8102E] rounded-full animate-spin" />
        <p className="text-gray-400 text-xs tracking-wide uppercase">Checking session…</p>
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={setUser} />;
  return <Dashboard user={user} onSignOut={() => setUser(null)} />;
}