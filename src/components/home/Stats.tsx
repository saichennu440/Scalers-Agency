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
    image_url: './selected_projects/brand_campign.png',
    video_url: 'https://youtube.com/shorts/yfXkZ-3NbBI?si=tuIWuaWWp7zKEuNY', // replace with your URL
  },
  {
    id: '2',
    title: 'Store Launch Film',
    category: 'Video Production',
    date: '2025',
    image_url: './selected_projects/product_launch.png',
    video_url: 'https://www.youtube.com/watch?v=emjaz9wsj04', // replace with your URL
  },
{
  id: '3',
  title: 'Social Media Creatives',
  category: 'Content',
  date: '2023',
  image_url: './selected_projects/creative.jpg',
  redirect_url: 'https://www.instagram.com/reel/DTKxkHokvhd/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', 
},
  {
    id: '4',
    title: 'Podcast Shoots',
    category: 'Events',
    date: '2023',
    image_url: './selected_projects/event_shoot.jpeg',
    video_file_url: 'https://www.instagram.com/reel/DUzY0yRD8UC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', // replace with your MP4
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

// (Keep your imports / types above unchanged)

export default function ProjectsSection() {
  const [selectedVideo, setSelectedVideo] = useState<Project | null>(null);

const handleProjectClick = (project: Project) => {
  // Project 2 → Open modal
  if (project.id === '2' && hasVideo(project)) {
    setSelectedVideo(project);
    return;
  }

  // Project 3 → Redirect to given link
  if (project.id === '3' && (project as any).redirect_url) {
    window.open((project as any).redirect_url, '_blank', 'noopener,noreferrer');
    return;
  }

  // Projects 1 & 4 → Open video in new tab
  if (hasVideo(project)) {
    const url = project.video_url ?? project.video_file_url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
  }
};

  const handleKeyDown = (e: React.KeyboardEvent, project: Project) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleProjectClick(project);
    }
  };

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
                // make interactive if it has a video or file
                className={`group block ${
  project.id === '1' || project.id === '2' || project.id === '3' || project.id === '4'
    ? 'cursor-pointer'
    : 'cursor-default'
}`}
                onClick={() => handleProjectClick(project)}
                onKeyDown={(e) => handleKeyDown(e, project)}
                role={hasVideo(project) ? 'link' : undefined}
                tabIndex={hasVideo(project) ? 0 : undefined}
                aria-label={
                  hasVideo(project)
                    ? `Open ${project.title} ${project.id === '2' ? 'modal' : 'in new tab'}`
                    : project.title
                }
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

      {/* Video Modal (unchanged) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {selectedVideo.video_file_url ? (
              <video src={selectedVideo.video_file_url} controls autoPlay playsInline className="w-full h-full rounded-lg" />
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