import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ClientContent } from '../lib/types';
import ClientCard from '../components/clients/ClientCard';
import ContentModal from '../components/clients/ContentModal';
import { Search, X, Play, SlidersHorizontal, Volume2, VolumeX, ChevronUp } from 'lucide-react';

interface ClientsPageProps {
  initialCategory?: string;
}

type ContentFilter = 'all' | 'reels' | 'videos' | 'creatives';

const FILTER_OPTIONS: { value: ContentFilter; label: string }[] = [
  { value: 'all',       label: 'All'       },
  { value: 'reels',     label: 'Reels'     },
  { value: 'videos',    label: 'Videos'    },
  { value: 'creatives', label: 'Creatives' },
];

/* ═══════════════════════════════════════════════════════════
   MOBILE REEL ITEM
   - Tap video area   → toggle mute / unmute
   - "View details" button → open modal
   - Videos autoplay muted (browser requirement), tap to hear
═══════════════════════════════════════════════════════════ */
function ReelItem({
  item,
  isActive,
  isMuted,
  isModalOpen,
  onToggleMute,
  onOpenModal,
}: {
  item: ClientContent;
  isActive: boolean;
  isMuted: boolean;
  isModalOpen: boolean;
  onToggleMute: () => void;
  onOpenModal: () => void;
}) {
  const fgVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Play / pause when active changes
  useEffect(() => {
    [fgVideoRef, bgVideoRef].forEach(ref => {
      const el = ref.current;
      if (!el) return;
      if (isActive) el.play().catch(() => {});
      else          el.pause();
    });
  }, [isActive]);

  // Pause when modal opens, resume when it closes (if still active)
  useEffect(() => {
    const el = fgVideoRef.current;
    const bg = bgVideoRef.current;
    if (!el) return;
    if (isModalOpen) {
      el.pause();
      bg?.pause();
    } else if (isActive) {
      el.play().catch(() => {});
      bg?.play().catch(() => {});
    }
  }, [isModalOpen]);

  // Sync muted state to the foreground video element
  useEffect(() => {
    const el = fgVideoRef.current;
    if (!el) return;
    el.muted = isMuted;
  }, [isMuted]);

  function getYouTubeId(url: string) {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  const ytId    = item.content_url ? getYouTubeId(item.content_url) : null;
  const isVid   = item.content_type === 'reels' || item.content_type === 'videos' || item.content_type === 'video';
  const isImg   = item.content_type === 'creatives' || item.content_type === 'image';
  const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null;

  // For images and YouTube thumbs there's no in-feed audio, so mute toggle is irrelevant
  const hasInFeedAudio = isVid && !ytId;

  return (
    <div
      className="relative w-full flex-shrink-0 snap-start snap-always overflow-hidden bg-black"
      style={{ height: '100svh' }}
    >
      {/* ── Blurred background layer ── */}
      {isImg && item.content_url && (
        <img src={item.content_url} alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(30px)', transform: 'scale(1.18)', opacity: 0.7 }} />
      )}
      {isVid && (ytThumb ? (
        <img src={ytThumb} alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(30px)', transform: 'scale(1.18)', opacity: 0.7 }} />
      ) : item.content_url ? (
        <video ref={bgVideoRef} src={item.content_url} loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(30px)', transform: 'scale(1.18)', opacity: 0.7 }} />
      ) : null)}

      <div className="absolute inset-0 bg-black/45" />

      {/* ── Foreground media layer — tappable to toggle audio ── */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ zIndex: 1 }}
        onClick={hasInFeedAudio ? onToggleMute : undefined}
      >
        {isImg && item.content_url && (
          <img src={item.content_url} alt={item.title}
            className="absolute inset-0 w-full h-full object-contain" />
        )}
        {isVid && (ytThumb ? (
          <img src={ytThumb} alt={item.title}
            className="absolute inset-0 w-full h-full object-contain" />
        ) : item.content_url ? (
          <video
            ref={fgVideoRef}
            src={item.content_url}
            loop
            muted       /* starts muted; we imperatively toggle via ref */
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : null)}
      </div>

      {/* ── Gradient overlay ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.0) 42%, rgba(0,0,0,0.30) 100%)' }} />

      {/* ── Play icon (YouTube / image — no in-feed audio) ── */}
      {isVid && !hasInFeedAudio && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 3 }}>
          <div className="w-[72px] h-[72px] rounded-full bg-white/12 border border-white/25 backdrop-blur-sm flex items-center justify-center">
            <Play size={26} className="text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* ── Mute / unmute indicator (direct video only) ── */}
      {hasInFeedAudio && (
        <button
          onClick={onToggleMute}
          className="absolute bottom-[168px] right-4 w-10 h-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 active:scale-90"
          style={{ zIndex: 5 }}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted
            ? <VolumeX size={17} className="text-white/70" />
            : <Volume2 size={17} className="text-white" />
          }
        </button>
      )}

      {/* ── Featured badge ── */}
      {item.is_featured && (
        <div className="absolute top-[88px] right-4 px-3 py-1 rounded-full bg-amber-400/90 backdrop-blur-sm text-[10px] font-bold text-black tracking-wide" style={{ zIndex: 4 }}>
          ★ Featured
        </div>
      )}

      {/* ── Type badge ── */}
      <div className="absolute top-[88px] left-4" style={{ zIndex: 4 }}>
        <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold capitalize tracking-wide border border-white/15">
          {item.content_type}
        </span>
      </div>

      {/* ── Bottom info + View Details button ── */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-20" style={{ zIndex: 4 }}>
        {item.category && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D91E36]/75 backdrop-blur-sm mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">{item.category}</span>
          </div>
        )}
        <h3 className="text-white font-serif text-2xl leading-snug mb-1 pointer-events-none">{item.title}</h3>
        {item.client_name && (
          <p className="text-white/45 text-[11px] font-bold tracking-[0.2em] uppercase pointer-events-none">{item.client_name}</p>
        )}
        {item.description && (
          <p className="text-white/55 text-sm mt-2 leading-relaxed line-clamp-2 pointer-events-none">{item.description}</p>
        )}

        {/* "View Details" — explicit button instead of tapping the whole card */}
        <button
          onClick={onOpenModal}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/25 backdrop-blur-sm text-white text-xs font-semibold tracking-wide hover:bg-white/20 active:scale-95 transition-all duration-200"
        >
          <ChevronUp size={13} />
          View Details
        </button>

        {/* Subtle tap-to-unmute hint shown only when muted video is active */}
        {hasInFeedAudio && isMuted && isActive && (
          <p className="text-white/25 text-[10px] mt-3 tracking-widest uppercase pointer-events-none">
            Tap video to hear audio
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function ClientsPage({ initialCategory = 'all' }: ClientsPageProps) {
  const [items,          setItems]          = useState<ClientContent[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [selectedItem,   setSelectedItem]   = useState<ClientContent | null>(null);
  const [search,         setSearch]         = useState('');
  const [activeFilter,   setActiveFilter]   = useState<ContentFilter>('all');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeReelIdx,  setActiveReelIdx]  = useState(0);
  const [filterOpen,     setFilterOpen]     = useState(false);

  // Global mute state — one toggle controls all reels (like TikTok)
  const [globalMuted, setGlobalMuted] = useState(true);

  const reelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setActiveCategory(initialCategory); setActiveReelIdx(0); }, [initialCategory]);
  useEffect(() => { fetchContent(); }, []);

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

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];

  const filtered = items.filter(item => {
    const s = search.toLowerCase();
    const matchSearch = !search
      || item.title?.toLowerCase().includes(s)
      || item.client_name?.toLowerCase().includes(s)
      || item.category?.toLowerCase().includes(s);
    const matchType = activeFilter === 'all' || item.content_type === activeFilter;
    const matchCat  = activeCategory === 'all' || item.category === activeCategory;
    return matchSearch && matchType && matchCat;
  });

  const ordered = (() => {
    if (activeCategory === 'all') {
      return [
        ...filtered.filter(i => i.is_featured),
        ...filtered.filter(i => !i.is_featured),
      ];
    }
    const inCat    = filtered.filter(i => i.category === activeCategory);
    const outOfCat = filtered.filter(i => i.category !== activeCategory);
    return [
      ...inCat.filter(i => i.is_featured),
      ...inCat.filter(i => !i.is_featured),
      ...outOfCat.filter(i => i.is_featured),
      ...outOfCat.filter(i => !i.is_featured),
    ];
  })();

  useEffect(() => {
    const container = reelRef.current;
    if (!container) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Array.from(container.children).indexOf(e.target as Element);
            if (idx >= 0) setActiveReelIdx(idx);
          }
        });
      },
      { root: container, threshold: 0.55 }
    );
    Array.from(container.children).forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, [ordered.length]);

  useEffect(() => {
    if (reelRef.current) reelRef.current.scrollTop = 0;
    setActiveReelIdx(0);
    setGlobalMuted(true); // reset to muted when filter changes
  }, [activeCategory, activeFilter]);

  return (
    <div className="bg-[#E8E4D9] min-h-screen">

      {/* ══════════════════════════════════════════
          MOBILE — Reels style
      ══════════════════════════════════════════ */}
      <div className="md:hidden relative" style={{ height: '100svh' }}>
        <div
          ref={reelRef}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {loading && (
            <div className="flex items-center justify-center bg-black" style={{ height: '100svh' }}>
              <div className="w-9 h-9 border-2 border-white/15 border-t-[#D91E36] rounded-full animate-spin" />
            </div>
          )}

          {!loading && ordered.length === 0 && (
            <div className="flex flex-col items-center justify-center bg-black text-center px-8 gap-5" style={{ height: '100svh' }}>
              <p className="text-white/15 font-serif text-6xl">∅</p>
              <p className="text-white/45 font-serif text-xl">No content found</p>
              <button
                onClick={() => { setSearch(''); setActiveFilter('all'); setActiveCategory('all'); setFilterOpen(false); }}
                className="px-6 py-2.5 rounded-full border border-white/20 text-white/50 text-sm hover:border-white/40 hover:text-white transition-all"
              >
                Clear filters
              </button>
            </div>
          )}

          {!loading && ordered.map((item, i) => (
            <ReelItem
              key={item.id}
              item={item}
              isActive={i === activeReelIdx}
              isMuted={globalMuted}
              isModalOpen={selectedItem !== null}
              onToggleMute={() => setGlobalMuted(m => !m)}
              onOpenModal={() => setSelectedItem(item)}
            />
          ))}
        </div>

        {/* Top bar */}
        <div
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)' }}
        >
          <div className="flex items-center justify-between px-4 pt-[72px] pb-5 pointer-events-auto">
            <div>
              <p className="text-white font-serif text-lg leading-none capitalize">
                {activeCategory === 'all' ? 'All Work' : activeCategory}
              </p>
              <p className="text-white/35 text-[10px] mt-0.5 tracking-widest uppercase">
                {ordered.length} items
              </p>
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className="w-9 h-9 rounded-full bg-black/30 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white"
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Progress dots */}
        {ordered.length > 1 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5 pointer-events-none">
            {ordered.slice(0, Math.min(ordered.length, 12)).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: 3,
                  height: i === activeReelIdx ? 20 : 3,
                  background: i === activeReelIdx ? '#D91E36' : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
            {ordered.length > 12 && (
              <span className="text-white/25 text-[8px] text-center mt-0.5">+{ordered.length - 12}</span>
            )}
          </div>
        )}

        {/* Filter bottom sheet */}
        <AnimatePresence>
          {filterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setFilterOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 380 }}
                className="absolute inset-x-0 bottom-0 z-40 rounded-t-3xl overflow-hidden"
                style={{ background: 'rgba(6,14,22,0.97)', backdropFilter: 'blur(24px)' }}
              >
                <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mt-4 mb-1" />
                <div className="px-5 pb-10 pt-4">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-white font-serif text-xl">Filter</p>
                    <button onClick={() => setFilterOpen(false)} className="text-white/35 hover:text-white p-1">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="relative mb-6">
                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search work…"
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/7 border border-white/10 text-white text-sm placeholder:text-white/22 focus:outline-none focus:border-[#D91E36] transition-colors"
                    />
                  </div>

                  <p className="text-white/25 text-[10px] tracking-[0.25em] uppercase mb-2.5">Content Type</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {FILTER_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setActiveFilter(value)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                          activeFilter === value
                            ? 'bg-[#D91E36] border-[#D91E36] text-white'
                            : 'border-white/12 text-white/45 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <p className="text-white/25 text-[10px] tracking-[0.25em] uppercase mb-2.5">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setFilterOpen(false); }}
                        className={`px-4 py-2 rounded-full text-xs font-semibold capitalize border transition-all duration-200 ${
                          activeCategory === cat
                            ? 'bg-[#D91E36] border-[#8B1E32] text-white'
                            : 'border-white/12 text-white/45 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {cat === 'all' ? 'All' : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP
      ══════════════════════════════════════════ */}
      <div className="hidden md:block">

        {/* Hero */}
        <section className="relative min-h-[52vh] bg-[#D91E36] flex flex-col overflow-hidden">
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#E8E4D9] z-10" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />

          <div className="flex-1 flex items-end pb-28 px-6 md:px-12 max-w-7xl mx-auto w-full pt-36 relative z-[1]">
            <div className="grid md:grid-cols-2 gap-12 items-end w-full">
              <div>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
                  className="text-white/40 text-xs tracking-[0.28em] uppercase font-semibold mb-4">Portfolio</motion.p>
                <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.95]">
                  Client<br /><span className="italic font-light">Success</span><br />Stories.
                </motion.h1>
              </div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28 }} className="md:mb-2">
                {activeCategory !== 'all' ? (
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/12 border border-white/20 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">{activeCategory}</span>
                    </div>
                    <p className="text-white/60 text-lg leading-relaxed">
                      Showing <span className="text-white font-semibold capitalize">{activeCategory}</span> work first, followed by everything else.
                    </p>
                  </div>
                ) : (
                  <p className="text-white/60 text-lg leading-relaxed">
                    Real results for real businesses. Explore our portfolio of reels, videos, and creatives.
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-30 bg-[#E8E4D9]/95 backdrop-blur-md border-b border-[#D91E36]/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center py-4">
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D91E36]/40" />
                <input
                  type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search work…"
                  className="w-full pl-9 pr-8 py-2.5 rounded-full border border-[#D91E36]/20 bg-white/60 text-[#8B1E32] text-sm placeholder:text-[#8B1E32]/30 focus:outline-none focus:border-[#D91E36] transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D91E36]/40 hover:text-[#D91E36]">
                    <X size={13} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {FILTER_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setActiveFilter(value)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
                      activeFilter === value
                        ? 'bg-[#D91E36] text-white border-[#D91E36] shadow-sm shadow-[#D91E36]/20'
                        : 'border-[#D91E36]/25 text-[#8B1E32] hover:border-[#D91E36] hover:text-[#D91E36]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span className="ml-auto text-[#8B1E32]/35 text-xs font-medium">
                {ordered.length} result{ordered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {categories.length > 1 && (
              <div className="flex gap-2 pb-3 overflow-x-auto" style={{ scrollbarWidth: 'none' } as React.CSSProperties}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-[#D91E36] text-white border-[#D91E36] shadow-sm'
                        : 'border-[#D91E36]/15 text-[#8B1E32]/60 hover:border-[#D91E36]/40 hover:text-[#8B1E32] bg-white/40'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D91E36] opacity-60" />
                        {cat}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/50 rounded-2xl aspect-[4/3] animate-pulse border border-[#D91E36]/6" />
              ))}
            </div>
          )}

          {!loading && ordered.length === 0 && (
            <div className="text-center py-32">
              <p className="text-5xl font-serif text-[#D91E36]/20 mb-4">∅</p>
              <p className="text-[#8B1E32]/50 font-semibold text-lg mb-1">No work found</p>
              <p className="text-[#8B1E32]/30 text-sm mb-8">Try adjusting your filters</p>
              <button
                onClick={() => { setSearch(''); setActiveFilter('all'); setActiveCategory('all'); }}
                className="px-7 py-2.5 rounded-full border border-[#D91E36]/30 text-[#D91E36] text-sm font-semibold hover:bg-[#D91E36] hover:text-white transition-all"
              >
                Clear filters
              </button>
            </div>
          )}

          {!loading && ordered.length > 0 && activeCategory !== 'all' && (() => {
            const inCat    = ordered.filter(i => i.category === activeCategory);
            const outOfCat = ordered.filter(i => i.category !== activeCategory);
            return (
              <>
                {inCat.length > 0 && (
                  <div className="mb-14">
                    <div className="flex items-center gap-4 mb-7">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D91E36]" />
                        <p className="text-[#D91E36] text-[10px] font-bold tracking-[0.28em] uppercase capitalize">{activeCategory}</p>
                      </div>
                      <div className="h-px flex-1 bg-[#D91E36]/15" />
                      <span className="text-[#D91E36]/40 text-[10px]">{inCat.length} item{inCat.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {inCat.map((item, i) => (
                        <ClientCard key={item.id} content={item} index={i} onClick={() => setSelectedItem(item)} />
                      ))}
                    </div>
                  </div>
                )}
                {outOfCat.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-7">
                      <p className="text-[#8B1E32]/35 text-[10px] font-bold tracking-[0.28em] uppercase">More Work</p>
                      <div className="h-px flex-1 bg-[#D91E36]/8" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {outOfCat.map((item, i) => (
                        <ClientCard key={item.id} content={item} index={i} onClick={() => setSelectedItem(item)} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {!loading && ordered.length > 0 && activeCategory === 'all' && (() => {
            const featured = ordered.filter(i => i.is_featured);
            const rest     = ordered.filter(i => !i.is_featured);
            return (
              <>
                {featured.length > 0 && (
                  <div className="mb-14">
                    <div className="flex items-center gap-4 mb-7">
                      <p className="text-[#D91E36] text-[10px] font-bold tracking-[0.28em] uppercase">Featured Work</p>
                      <div className="h-px flex-1 bg-[#D91E36]/12" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featured.map((item, i) => (
                        <ClientCard key={item.id} content={item} index={i} onClick={() => setSelectedItem(item)} />
                      ))}
                    </div>
                  </div>
                )}
                {rest.length > 0 && (
                  <div>
                    {featured.length > 0 && (
                      <div className="flex items-center gap-4 mb-7">
                        <p className="text-[#8B1E32]/40 text-[10px] font-bold tracking-[0.28em] uppercase">All Work</p>
                        <div className="h-px flex-1 bg-[#D91E36]/10" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {rest.map((item, i) => (
                        <ClientCard key={item.id} content={item} index={i} onClick={() => setSelectedItem(item)} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {selectedItem && <ContentModal content={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}