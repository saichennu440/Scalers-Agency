import { ArrowRight } from 'lucide-react';
import { Page } from '../../lib/types';

interface CTAProps {
  onNavigate: (page: Page) => void;
}

export default function CTA({ onNavigate }: CTAProps) {
  return (
    <section className="py-28 bg-[#0f0f0f] relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-8"
        style={{ backgroundImage: `url('https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1920')` }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E]/15 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 via-transparent to-[#0f0f0f]/40" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-10 bg-[#C8102E]" />
          <span className="text-[#C8102E] text-[10px] font-semibold tracking-[0.3em] uppercase">
            Ready to Scale?
          </span>
          <div className="h-px w-10 bg-[#C8102E]" />
        </div>

        {/* Headline — serif to match site */}
        <h2 className="font-serif text-5xl md:text-7xl text-white leading-[1.0] mb-6">
          Let's Build Your
          <br />
          <span className="italic font-light text-[#C8102E]">Success Story.</span>
        </h2>

        {/* Sub */}
        <p className="text-white/45 text-base md:text-lg leading-relaxed mb-12 max-w-xl mx-auto font-light">
          Join over 200 businesses that have transformed their growth trajectory with Scalers. Get a free strategy consultation today.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0 }); }}
            className="group relative flex items-center gap-2.5 px-9 py-4 bg-[#C8102E] hover:bg-[#a50d25] text-white font-semibold text-sm tracking-widest uppercase rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-[#C8102E]/25 hover:-translate-y-0.5 overflow-hidden"
          >
            {/* shine sweep */}
            <span className="absolute inset-0 bg-white/10 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12 pointer-events-none" />
            Get Free Consultation
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <button
            onClick={() => { onNavigate('clients'); window.scrollTo({ top: 0 }); }}
            className="flex items-center gap-2.5 px-9 py-4 border border-white/20 text-white/70 hover:text-white font-semibold text-sm tracking-widest uppercase rounded-full hover:border-white/40 hover:bg-white/5 transition-all duration-200"
          >
            View Our Work
          </button>
        </div>
      </div>
    </section>
  );
}