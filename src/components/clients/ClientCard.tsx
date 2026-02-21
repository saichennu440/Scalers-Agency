import { Play, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClientContent } from '../../lib/types';

interface ClientCardProps {
  content: ClientContent;
  onClick: () => void;
  index?: number;
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

function VideoThumbnail({ url }: { url: string }) {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return (
      <img
        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
        alt="Video thumbnail"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
    );
  }
  return (
    <video
      src={url}
      className="w-full h-full object-cover"
      preload="metadata"
      muted
      playsInline
    />
  );
}

export default function ClientCard({ content, onClick, index = 0 }: ClientCardProps) {
 const isVideo =
  content.content_type === 'video' ||
  content.content_type === 'videos' ||
  content.content_type === 'reels';

const isImage =
  content.content_type === 'image' ||
  content.content_type === 'creatives';
  const isText  = content.content_type === 'text';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#D91E36]/8 transition-all duration-400 border border-[#D91E36]/6"
      onClick={onClick}
    >
      {/* ── Media ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f0eb]">
        {isImage && content.content_url ? (
          <img
            src={content.content_url}
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : isVideo && content.content_url ? (
          <div className="relative w-full h-full">
            <VideoThumbnail url={content.content_url} />
            {/* red tint overlay */}
            <div className="absolute inset-0 bg-[#D91E36]/20 group-hover:bg-[#D91E36]/10 transition-colors duration-400" />
            {/* play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Play size={20} className="text-[#D91E36] ml-1" fill="#D91E36" />
              </div>
            </div>
          </div>
        ) : (
          /* Text card */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f5f0eb] to-[#ede8e0] p-8 relative">
            <FileText size={40} className="absolute opacity-5 text-[#D91E36]" />
            <p className="text-[#8B1E32]/60 text-sm leading-relaxed text-center line-clamp-5 font-serif italic relative z-10">
              "{content.content_text}"
            </p>
          </div>
        )}

        {/* Featured badge */}
        {content.is_featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#D91E36] text-white text-[10px] font-bold tracking-[0.15em] uppercase rounded-full">
            Featured
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[#8B1E32] text-[10px] font-semibold capitalize border border-[#D91E36]/10">
            {content.content_type}
          </span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-6">
        {content.category && (
          <p className="text-[#D91E36] text-[10px] font-bold tracking-[0.22em] uppercase mb-2">
            {content.category}
          </p>
        )}
        <h3 className="font-serif text-[#8B1E32] text-xl leading-snug mb-2 group-hover:text-[#D91E36] transition-colors duration-200">
          {content.title}
        </h3>
        {content.description && (
          <p className="text-[#8B1E32]/55 text-sm leading-relaxed line-clamp-2">
            {content.description}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-[#D91E36]/8 pt-4">
          {content.client_name
            ? <span className="text-xs text-[#8B1E32]/40 font-medium">{content.client_name}</span>
            : <span />
          }
          <span className="text-xs text-[#D91E36] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
            View details
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}