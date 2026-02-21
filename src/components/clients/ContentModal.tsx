import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientContent } from '../../lib/types';

interface ContentModalProps {
  content: ClientContent;
  onClose: () => void;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

function VideoPlayer({ url }: { url: string }) {
  const ytId    = getYouTubeId(url);
  const vimeoId = getVimeoId(url);

  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }
  if (vimeoId) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&color=D91E36`}
        title="Vimeo video"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    );
  }
  return (
    <video src={url} controls autoPlay playsInline className="w-full h-full">
      <source src={url} />
    </video>
  );
}

export default function ContentModal({ content, onClose }: ContentModalProps) {
 const isVideo =
  content.content_type === 'video' ||
  content.content_type === 'videos' ||
  content.content_type === 'reels';
  const ytId     = content.content_url ? getYouTubeId(content.content_url) : null;
  const vimeoId  = content.content_url ? getVimeoId(content.content_url)   : null;
  const isEmbed  = !!(ytId || vimeoId);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Panel */}
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#E8E4D9] w-full sm:max-w-3xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/70 hover:bg-[#D91E36] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-[#D91E36]/10 text-[#8B1E32]"
          >
            <X size={16} />
          </button>

          {/* ── Media ── */}
          {content.content_type === 'image' && content.content_url && (
            <div className="aspect-video bg-[#f5f0eb] shrink-0">
              <img
                src={content.content_url}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {isVideo && content.content_url && (
            <div className="aspect-video bg-black shrink-0">
              <VideoPlayer url={content.content_url} />
            </div>
          )}

          {/* Text hero */}
          {content.content_type === 'text' && (
            <div className="relative bg-[#D91E36] px-10 py-14 shrink-0 overflow-hidden">
              <div className="absolute top-4 right-8 text-white/10 text-9xl font-serif leading-none select-none">"</div>
              <p className="text-white/90 text-lg font-serif italic leading-relaxed relative z-10 max-w-lg mx-auto text-center">
                {content.content_text}
              </p>
            </div>
          )}

          {/* ── Info ── */}
          <div className="overflow-y-auto">
            <div className="p-7 md:p-10">
              {/* badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {content.category && (
                  <span className="px-3 py-1 rounded-full bg-[#D91E36]/10 text-[#D91E36] text-[10px] font-bold tracking-[0.2em] uppercase border border-[#D91E36]/15">
                    {content.category}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-white/60 text-[#8B1E32]/50 text-[10px] font-semibold capitalize border border-[#D91E36]/8">
                  {content.content_type}
                </span>
                {content.is_featured && (
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold tracking-[0.15em] uppercase border border-amber-200">
                    ★ Featured
                  </span>
                )}
              </div>

              {/* Title + client logo */}
              <div className="flex items-start justify-between gap-6 mb-5">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-serif text-[#8B1E32] leading-snug">
                    {content.title}
                  </h2>
                  {content.client_name && (
                    <p className="text-[#D91E36] text-xs font-semibold tracking-widest uppercase mt-1.5">
                      {content.client_name}
                    </p>
                  )}
                </div>
                {content.client_logo_url && (
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-white border border-[#D91E36]/10 flex items-center justify-center p-2 shadow-sm">
                    <img
                      src={content.client_logo_url}
                      alt={content.client_name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {content.description && (
                <p className="text-[#8B1E32]/60 text-sm leading-relaxed mb-4">
                  {content.description}
                </p>
              )}

              {/* Long-form text content */}
              {content.content_type === 'text' && content.content_text && (
                <div className="bg-white/50 rounded-2xl p-6 border border-[#D91E36]/8">
                  {content.content_text.split('\n').map((para, i) => (
                    <p key={i} className="text-[#8B1E32]/70 text-sm leading-relaxed mb-3 last:mb-0 font-serif">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* External links */}
              <div className="mt-6 pt-5 border-t border-[#D91E36]/10 flex items-center gap-4">
                {content.content_url && (
                  <a
                    href={content.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-[#8B1E32]/40 hover:text-[#D91E36] transition-colors duration-200 tracking-wide font-medium"
                  >
                    <ExternalLink size={12} />
                    {isVideo ? 'Open video' : 'View full image'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}