import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Page } from '../../lib/types';
import { supabase } from '../../lib/supabase';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onClientsCategory: (category: string) => void;
}

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: 'Home',     page: 'home'     },
  { label: 'About',    page: 'about'    },
  { label: 'Services', page: 'services' },
  { label: 'Contact',  page: 'contact'  },
];

export default function Header({ currentPage, onNavigate, onClientsCategory }: HeaderProps) {
  const [scrolled,      setScrolled]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [categories,    setCategories]    = useState<string[]>([]);
  const [dropOpen,      setDropOpen]      = useState(false);
  const [mobileCliOpen, setMobileCliOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  /* ── Scroll ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* ── Fetch categories from the categories table (not client_content) ── */
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('categories')
        .select('name')
        .order('created_at', { ascending: true });
      if (data) setCategories(data.map(d => d.name));
    };
    load();

    // Realtime: update instantly when admin adds/deletes a category
    const ch = supabase
      .channel('header-categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const goPage = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
    setDropOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goCategory = (cat: string) => {
    onClientsCategory(cat);
    setDropOpen(false);
    setMobileOpen(false);
    setMobileCliOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome    = currentPage === 'home';
  const isClients = currentPage === 'clients';

  const navBg  = scrolled ? 'rgba(6,16,31,0.92)' : 'transparent';
  const border = scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: navBg, backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: border }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo ── */}
          <button onClick={() => goPage('home')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 shrink-0">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <polygon points="20,5 35,35 20,25 5,35" fill="#D91E36" opacity="0.5" />
                <polygon points="20,5 35,35 32,33 20,25 20,24" fill="#D91E36" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-white tracking-widest">SCALERS</span>
              <span className="text-[8px] tracking-[0.2em] font-light text-white/60">BUSINESS AGENCY</span>
            </div>
          </button>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/5 border border-white/10">

              {NAV_LINKS.map(({ label, page }) => (
                <button
                  key={page}
                  onClick={() => goPage(page)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}

              {/* Clients with dropdown */}
              <div ref={dropRef} className="relative">
                <button
                  onClick={() => setDropOpen(o => !o)}
                  onMouseEnter={() => setDropOpen(true)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                    isClients
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Clients
                  <ChevronDown size={11} className={`transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 min-w-[210px] rounded-2xl overflow-hidden shadow-2xl border border-white/8 z-50"
                    style={{ background: 'rgba(8,14,26,0.97)', backdropFilter: 'blur(24px)' }}
                    onMouseLeave={() => setDropOpen(false)}
                  >
                    {/* All Work */}
                    <button
                      onClick={() => goCategory('all')}
                      className="w-full text-left px-5 py-3.5 text-[11px] font-bold text-white/50 hover:text-white hover:bg-white/6 uppercase tracking-[0.22em] transition-colors border-b border-white/6"
                    >
                      All Work
                    </button>

                    {/* One row per category (from categories table) */}
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => goCategory(cat)}
                        className="w-full text-left flex items-center gap-3 px-5 py-3.5 text-[11px] font-semibold text-white/55 hover:text-white hover:bg-white/6 capitalize tracking-wide transition-colors border-b border-white/4 last:border-0"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D91E36] shrink-0" />
                        {cat}
                      </button>
                    ))}

                    {categories.length === 0 && (
                      <div className="px-5 py-4 text-[11px] text-white/20 italic">
                        No categories yet — add them in admin.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => goPage('contact')}
              className="ml-4 flex items-center gap-2 px-5 py-2.5 bg-[#D91E36] hover:bg-[#B01830] text-white text-xs font-bold tracking-wide uppercase rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#D91E36]/20 hover:-translate-y-0.5"
            >
              Get Started
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: 'rgba(6,16,31,0.97)', borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
        >
          <div className="px-6 py-5 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => goPage(page)}
                className={`text-left text-sm font-semibold tracking-wide uppercase py-3 px-4 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}

            {/* Mobile Clients accordion */}
            <div className="border-t border-white/6 pt-1 mt-1">
              <button
                onClick={() => setMobileCliOpen(o => !o)}
                className={`w-full flex items-center justify-between text-sm font-semibold tracking-wide uppercase py-3 px-4 rounded-lg transition-colors ${
                  isClients ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                Clients
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileCliOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileCliOpen && (
                <div className="ml-4 border-l border-white/8 pl-4 mt-1 flex flex-col gap-0.5">
                  <button
                    onClick={() => goCategory('all')}
                    className="text-left text-[11px] font-bold text-white/35 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 uppercase tracking-[0.22em] transition-colors"
                  >
                    All Work
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => goCategory(cat)}
                      className="text-left flex items-center gap-2.5 text-[11px] font-semibold text-white/40 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 capitalize tracking-wide transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D91E36] shrink-0" />
                      {cat}
                    </button>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-[10px] text-white/20 italic px-3 py-2">No categories yet</p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => goPage('contact')}
              className="mt-3 flex items-center justify-center gap-2 px-5 py-3 bg-[#D91E36] hover:bg-[#B01830] text-white text-sm font-bold tracking-wide uppercase rounded-xl transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}