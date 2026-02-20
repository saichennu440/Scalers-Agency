import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ClientContent } from '../lib/types';
import ClientCard from '../components/clients/ClientCard';
import ContentModal from '../components/clients/ContentModal';
import { Search, X } from 'lucide-react';

export default function ClientsPage() {
  const [items, setItems] = useState<ClientContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ClientContent | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | 'text'>('all');
  const [activeCategory, setActiveCategory] = useState('all');

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

  const featured = filtered.filter(i => i.is_featured);
  const regular  = filtered.filter(i => !i.is_featured);

  return (
    <div className="bg-[#E8E4D9] min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[52vh] bg-[#D91E36] flex flex-col overflow-hidden">
        {/* noise texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
          }}
        />
        {/* watermark word */}
        <div className="absolute right-4 bottom-10 text-white/[0.045] text-[10rem] md:text-[16rem] font-black font-serif leading-none select-none pointer-events-none">
          WORK
        </div>
        {/* diagonal slice */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 bg-[#E8E4D9] z-10"
          style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
        />

        <div className="flex-1 flex items-end pb-28 px-6 md:px-12 max-w-7xl mx-auto w-full pt-36 relative z-[1]">
          <div className="grid md:grid-cols-2 gap-12 items-end w-full">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="text-white/40 text-xs tracking-[0.28em] uppercase font-semibold mb-4"
              >
                Portfolio
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.95]"
              >
                Client
                <br />
                <span className="italic font-light">Success</span>
                <br />
                Stories.
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28 }}
              className="text-white/60 text-lg leading-relaxed md:mb-2"
            >
              Real results for real businesses. Explore our portfolio of campaigns,
              case studies, and creative work delivered for our clients.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Filter bar — sticky ───────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#E8E4D9]/95 backdrop-blur-md border-b border-[#D91E36]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center py-4">

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D91E36]/40" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search work..."
                className="w-full pl-9 pr-8 py-2.5 rounded-full border border-[#D91E36]/20 bg-white/60 text-[#8B1E32] text-sm placeholder:text-[#8B1E32]/30 focus:outline-none focus:border-[#D91E36] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D91E36]/40 hover:text-[#D91E36] transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Type filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'image', 'video', 'text'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold capitalize tracking-wide transition-all duration-200 border ${
                    activeFilter === type
                      ? 'bg-[#D91E36] text-white border-[#D91E36] shadow-sm shadow-[#D91E36]/20'
                      : 'border-[#D91E36]/25 text-[#8B1E32] hover:border-[#D91E36] hover:text-[#D91E36]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Result count */}
            {!loading && (
              <span className="ml-auto text-[#8B1E32]/35 text-xs font-medium hidden sm:block">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Category pills */}
          {categories.length > 1 && (
            <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    activeCategory === cat
                      ? 'bg-[#8B1E32] text-white border-[#8B1E32]'
                      : 'border-[#D91E36]/15 text-[#8B1E32]/60 hover:border-[#8B1E32]/40 hover:text-[#8B1E32] bg-white/40'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/50 rounded-2xl aspect-[4/3] animate-pulse border border-[#D91E36]/6" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-32">
            <p className="text-5xl font-serif text-[#D91E36]/20 mb-4">∅</p>
            <p className="text-[#8B1E32]/50 font-semibold text-lg mb-1">No work found</p>
            <p className="text-[#8B1E32]/30 text-sm mb-8">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setActiveFilter('all'); setActiveCategory('all'); }}
              className="px-7 py-2.5 rounded-full border border-[#D91E36]/30 text-[#D91E36] text-sm font-semibold hover:bg-[#D91E36] hover:text-white transition-all duration-200"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Featured */}
        {!loading && featured.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-7">
              <p className="text-[#D91E36] text-[10px] font-bold tracking-[0.28em] uppercase">Featured Work</p>
              <div className="h-px flex-1 bg-[#D91E36]/12" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((item, i) => (
                <ClientCard
                  key={item.id}
                  content={item}
                  index={i}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All work */}
        {!loading && regular.length > 0 && (
          <div>
            {featured.length > 0 && (
              <div className="flex items-center gap-4 mb-7">
                <p className="text-[#8B1E32]/40 text-[10px] font-bold tracking-[0.28em] uppercase">All Work</p>
                <div className="h-px flex-1 bg-[#D91E36]/10" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((item, i) => (
                <ClientCard
                  key={item.id}
                  content={item}
                  index={i}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <ContentModal content={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}