import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Page } from '../../lib/types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navLinks: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Services', page: 'services' },
  { label: 'Clients', page: 'clients' },
  // { label: 'Contact', page: 'contact' },
];

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = currentPage === 'home';

  // On home: always dark/transparent. On other pages: white bg.
  const isDark = isHome || !scrolled;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? isHome
            ? 'rgba(6,16,31,0.92)'
            : 'rgba(6,16,31,0.92)'
          : isHome
          ? 'transparent'
          : 'rgba(217, 30, 54, 0.65)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled
          ? isHome
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(0,0,0,0.07)'
          : 'none',
        boxShadow: scrolled && !isHome ? '0 1px 20px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <polygon points="20,5 35,35 20,25 5,35" fill="#D91E36" opacity="0.5" />
                <polygon points="20,5 35,35 32,33 20,25 20,24" fill="#D91E36" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-white tracking-widest">SCALERS</span>
              <span className={`text-[8px] tracking-[0.3em] font-light transition-colors duration-300 ${isHome ? 'text-white/40' : 'text-gray-400'}`}>
                BUSINESS AGENCY
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center">
            {/* pill container */}
            <div
              className={`flex items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-300 ${
                isHome
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              {navLinks.map(({ label, page }) => (
                <button
                  key={page}
                  onClick={() => handleNav(page)}
                  className={`relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                    currentPage === page
                      ? isHome
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'bg-white text-[#C8102E] shadow-sm'
                      : isHome
                      ? 'text-white/50 hover:text-white hover:bg-white/5'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => handleNav('contact')}
              className="ml-4 flex items-center gap-2 px-5 py-2.5 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold tracking-wide uppercase rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#C8102E]/20 hover:-translate-y-0.5"
            >
              Get Started
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${isHome ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: isHome ? 'rgba(6,16,31,0.97)' : 'rgba(255,255,255,0.98)',
            borderColor: isHome ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="px-6 py-5 flex flex-col gap-1">
            {navLinks.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => handleNav(page)}
                className={`text-left text-sm font-semibold tracking-wide uppercase py-3 px-4 rounded-lg transition-colors duration-200 ${
                  currentPage === page
                    ? isHome
                      ? 'bg-white/10 text-white'
                      : 'bg-red-50 text-[#C8102E]'
                    : isHome
                    ? 'text-white/50 hover:text-white hover:bg-white/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => handleNav('contact')}
              className="mt-3 flex items-center justify-center gap-2 px-5 py-3 bg-[#C8102E] hover:bg-[#a50d25] text-white text-sm font-bold tracking-wide uppercase rounded-xl transition-colors duration-200"
            >
              Get Started
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}