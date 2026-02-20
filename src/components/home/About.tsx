import { CheckCircle, ArrowRight } from 'lucide-react';
import { Page } from '../../lib/types';

interface AboutProps {
  onNavigate: (page: Page) => void;
}

const highlights = [
  'Certified growth marketing specialists',
  'Proven frameworks across 12 industries',
  'Dedicated account team per client',
  'Monthly performance reviews & strategy pivots',
];

export default function About({ onNavigate }: AboutProps) {
  return (
    <section className="py-24 bg-[#E8E4D9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image block */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Scalers team at work"
                className="w-full h-full object-cover"
              />
              {/* red tint overlay consistent with project cards */}
              <div className="absolute inset-0 bg-[#D91E36]/10" />
            </div>
            {/* stat badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#D91E36] text-white p-6 rounded-2xl hidden lg:block shadow-xl shadow-[#D91E36]/20">
              <div className="text-4xl font-serif font-light">8+</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-red-100 mt-1 font-medium">Years in Business</div>
            </div>
          </div>

          {/* Text block */}
          <div>
            {/* eyebrow */}
            <p className="text-[#D91E36] text-[10px] font-bold tracking-[0.28em] uppercase mb-5">
              About Scalers
            </p>

            {/* headline — serif matching rest of site */}
            <h2 className="font-serif text-4xl md:text-5xl text-[#8B1E32] leading-tight mb-6">
              The Agency Built
              <br />
              <span className="italic font-light text-[#D91E36]">For Growth.</span>
            </h2>

            <p className="text-[#8B1E32]/60 text-sm leading-relaxed mb-4">
              Scalers is a full-service business growth agency specializing in helping ambitious companies break through plateaus and scale to their next level. We combine strategic thinking with creative execution to deliver measurable outcomes.
            </p>
            <p className="text-[#8B1E32]/60 text-sm leading-relaxed mb-8">
              From startups to established enterprises, our team of specialists works as an extension of your team — fully invested in your success and accountable to real results.
            </p>

            {/* highlights */}
            <ul className="space-y-3 mb-10">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle size={15} className="text-[#D91E36] shrink-0" />
                  <span className="text-sm text-[#8B1E32]/70">{item}</span>
                </li>
              ))}
            </ul>

            {/* link */}
            <button
              onClick={() => { onNavigate('services'); window.scrollTo({ top: 0 }); }}
              className="inline-flex items-center gap-2 text-[#D91E36] font-semibold text-sm hover:gap-4 transition-all duration-200 group"
            >
              Explore our services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}