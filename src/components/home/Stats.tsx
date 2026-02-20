import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, X } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  date?: string;
  image_url?: string;
  video_url?: string;       // YouTube / Vimeo URL
  video_file_url?: string;  // Direct MP4 / hosted file URL
}

// ─── ADD YOUR PROJECTS HERE ───────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Brand Campaign 2024',
    category: 'Branding',
    date: '2024',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // replace with your URL
  },
  {
    id: '2',
    title: 'Product Launch Film',
    category: 'Video Production',
    date: '2024',
    image_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    video_url: 'https://vimeo.com/76979871', // replace with your URL
  },
  {
    id: '3',
    title: 'Social Media Series',
    category: 'Content',
    date: '2023',
    image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    // no video — card will not be clickable
  },
  {
    id: '4',
    title: 'Event Highlight Reel',
    category: 'Events',
    date: '2023',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    video_file_url: 'https://www.w3schools.com/html/mov_bbb.mp4', // replace with your MP4
  },
];
// ─────────────────────────────────────────────────────────────────────────────

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  // YouTube
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return url;
}

function hasVideo(project: Project) {
  return !!(project.video_url || project.video_file_url);
}

export default function ProjectsSection() {
  const [selectedVideo, setSelectedVideo] = useState<Project | null>(null);

  return (
    <section id="projects" className="bg-[#E8E4D9] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#D91E36] mb-6 md:mb-0"
          >
            Selected projects
          </motion.h2>

          {/* Replace href with your router navigation if needed */}
          <a
            href="/#clients"
            className="flex items-center gap-2 text-[#8B1E32] hover:text-[#D91E36] transition-colors group"
          >
            <span>See more</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Grid */}
        {PROJECTS.length === 0 ? (
          <p className="text-center text-[#8B1E32] py-12">No projects to display yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {PROJECTS.slice(0, 4).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group block ${hasVideo(project) ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => hasVideo(project) && setSelectedVideo(project)}
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                  <img
                    src={project.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#D91E36] opacity-40 group-hover:opacity-30 transition-opacity" />
                  {hasVideo(project) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-6 h-6 text-[#D91E36] ml-1" fill="#D91E36" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl md:text-3xl font-serif text-[#D91E36] mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    {project.title}
                  </h3>
                  <p className="text-[#8B1E32]/70">
                    {project.category}
                    {project.date && <span className="ml-2">, {project.date}</span>}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {selectedVideo.video_file_url ? (
              <video
                src={selectedVideo.video_file_url}
                controls
                autoPlay
                playsInline
                className="w-full h-full rounded-lg"
              />
            ) : (
              <iframe
                src={getEmbedUrl(selectedVideo.video_url) ?? ''}
                className="w-full h-full rounded-lg"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}