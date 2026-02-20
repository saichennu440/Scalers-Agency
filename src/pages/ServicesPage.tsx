import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Minus } from 'lucide-react';

// ─── EDIT YOUR SERVICES HERE ─────────────────────────────────────────────────
const SERVICES = [
  {
    id: '1',
    title: 'Brand Strategy & Identity',
    description:
      'We craft brand identities that go far beyond logos — building a complete visual language, tone of voice, and positioning framework that resonates with your audience and stands apart in the market.',
  },
  {
    id: '2',
    title: 'Performance Marketing',
    description:
      'Data-driven paid campaigns across Google, Meta, and LinkedIn, engineered to maximise ROI. From targeting and creative to landing pages and attribution, every variable is optimised for growth.',
  },
  {
    id: '3',
    title: 'Content Creation & SEO',
    description:
      'Long-term organic growth through strategic content, technical SEO audits, authority link-building, and editorial calendars that position your brand as an industry leader.',
  },
  {
    id: '4',
    title: 'Social Media Management',
    description:
      'Consistent, compelling presence across Instagram, LinkedIn, TikTok, and X. We handle strategy, creative, scheduling, community management, and monthly performance reporting.',
  },
  {
    id: '5',
    title: 'Lead Generation & Funnels',
    description:
      'End-to-end funnel architecture — from awareness campaigns to nurture sequences and CRM pipelines — designed to capture, qualify, and convert high-intent prospects at scale.',
  },
  {
    id: '6',
    title: 'Marketing Automation',
    description:
      'We design and implement automated workflows, email sequences, and CRM integrations that save your team hours each week while delivering personalised experiences to every prospect.',
  },
];

// ─── PROCESS STEPS ────────────────────────────────────────────────────────────
const PROCESS = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We dive deep into your brand, audience, and goals to uncover opportunities others miss.',
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'Tailored roadmaps built on data, creativity, and industry-leading insights.',
  },
  {
    number: '03',
    title: 'Execution',
    description: 'Flawless delivery across every channel with relentless attention to detail.',
  },
  {
    number: '04',
    title: 'Optimisation',
    description: 'Continuous analysis and refinement to ensure peak performance and ROI.',
  },
];

// ─── RESULTS STATS ────────────────────────────────────────────────────────────
const STATS = [
  { value: '50+',  label: 'Brands Scaled' },
  { value: '340%', label: 'Average ROI' },
  { value: '200+', label: 'Campaigns Run' },
  { value: '6+',   label: 'Years of Expertise' },
];

interface ServicesPageProps {
  onNavigate?: (page: string) => void;
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#E8E4D9] min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] bg-[#D91E36] flex flex-col overflow-hidden">
        {/* diagonal slice */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 bg-[#E8E4D9] z-10"
          style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
        />
        {/* noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
          }}
        />

        <div className="flex-1 flex items-end pb-32 px-6 md:px-12 max-w-7xl mx-auto w-full pt-36 relative z-[1]">
          <div className="grid md:grid-cols-2 gap-12 items-end w-full">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.95]"
            >
              What we
              <br />
              <span className="italic font-light">do best.</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:mb-2"
            >
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                From strategy to execution, we offer end-to-end marketing solutions
                that drive measurable growth and lasting brand impact.
              </p>
              {/* inline stats */}
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.08, duration: 0.6 }}
                    className="border border-white/15 rounded-xl px-4 py-3 bg-white/5 backdrop-blur-sm"
                  >
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-white/50 text-xs mt-0.5 tracking-wide">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Services Accordion ───────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 items-start">

            {/* sticky left column */}
            <div className="md:col-span-4 md:sticky md:top-32">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-[#D91E36] text-xs tracking-[0.25em] uppercase font-semibold mb-4"
              >
                Our Services
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#8B1E32] leading-tight mb-8"
              >
                Tailored solutions for ambitious brands.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-[#8B1E32]/60 text-sm leading-relaxed mb-8"
              >
                Every engagement starts with understanding your unique challenges.
                We then build solutions that fit — no cookie-cutter playbooks.
              </motion.p>
              <button
                onClick={() => onNavigate?.('clients')}
                className="inline-flex items-center gap-2 text-[#D91E36] font-semibold text-sm hover:gap-4 transition-all group"
              >
                View our work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* accordion right */}
            <div className="md:col-span-8">
              <div className="space-y-0">
                {SERVICES.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.55 }}
                    viewport={{ once: true }}
                    className="border-t border-[#D91E36]/15"
                  >
                    <button
                      className="w-full flex items-center justify-between py-6 md:py-8 text-left group"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                      <div className="flex items-center gap-5 md:gap-8">
                        <span className="text-xs text-[#D91E36]/30 font-light tabular-nums w-5 shrink-0">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-xl md:text-2xl font-serif text-[#8B1E32] group-hover:text-[#D91E36] transition-colors duration-200">
                          {service.title}
                        </h3>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-[#D91E36]/25 flex items-center justify-center shrink-0 ml-4 group-hover:bg-[#D91E36] group-hover:border-[#D91E36] transition-all duration-200">
                        {openIndex === index
                          ? <Minus className="w-4 h-4 text-[#D91E36] group-hover:text-white transition-colors" />
                          : <Plus  className="w-4 h-4 text-[#D91E36] group-hover:text-white transition-colors" />
                        }
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pl-10 md:pl-14 pb-8">
                            <p className="text-[#8B1E32]/65 leading-relaxed">
                              {service.description}
                            </p>
                            <button
                              onClick={() => onNavigate?.('contact')}
                              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#D91E36] hover:gap-3 transition-all group"
                            >
                              Enquire about this service
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
                <div className="border-t border-[#D91E36]/15" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#D91E36] relative overflow-hidden">
        {/* background number watermark */}
        <div className="absolute right-0 top-0 text-white/[0.04] text-[22rem] font-black leading-none select-none pointer-events-none">
          HOW
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-white/40 text-xs tracking-[0.25em] uppercase font-semibold mb-3">Our Process</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">How we work</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-0 md:gap-0">
            {PROCESS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative border-l border-white/10 pl-8 py-8 md:py-0 md:pb-0"
              >
                <span className="text-white/10 text-8xl font-black font-serif block mb-4 leading-none -ml-2">
                  {step.number}
                </span>
                <h3 className="text-xl font-serif text-white mb-3">{step.title}</h3>
                <p className="text-white/55 leading-relaxed text-sm pr-6">{step.description}</p>
                {/* connector arrow */}
                {i < PROCESS.length - 1 && (
                  <div className="hidden md:flex absolute top-12 -right-3 z-10 w-6 h-6 rounded-full bg-[#D91E36] border border-white/20 items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-white/60" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-[#E8E4D9]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#D91E36] text-xs tracking-[0.25em] uppercase font-semibold mb-4">Why Scalers</p>
              <h2 className="text-3xl md:text-5xl font-serif text-[#8B1E32] leading-tight mb-6">
                Results you can<br />
                <span className="italic font-light text-[#D91E36]">measure and feel.</span>
              </h2>
              <p className="text-[#8B1E32]/60 leading-relaxed mb-8">
                We're not a typical agency. Every decision we make is anchored in data, every creative move is intentional, and every campaign is built to grow with your business — not just look good in a deck.
              </p>
              <button
                onClick={() => onNavigate?.('contact')}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#D91E36] text-white rounded-full hover:bg-[#B01830] transition-colors text-sm font-semibold group"
              >
                Start a project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🎯', title: 'Goal-First', desc: 'Every tactic ties back to a concrete business objective.' },
                { icon: '📊', title: 'Data-Led',   desc: 'Decisions driven by performance data, not guesswork.' },
                { icon: '⚡', title: 'Fast & Lean', desc: 'No bloat. Dedicated teams that move quickly and efficiently.' },
                { icon: '🔍', title: 'Transparent', desc: 'Full reporting access — no smoke, no mirrors, no surprises.' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.55 }}
                  viewport={{ once: true }}
                  className="bg-white/60 border border-[#D91E36]/8 rounded-2xl p-6 hover:bg-white hover:shadow-md transition-all duration-300 group"
                >
                  <span className="text-2xl block mb-3">{f.icon}</span>
                  <h4 className="font-serif text-[#8B1E32] text-lg mb-1 group-hover:text-[#D91E36] transition-colors">{f.title}</h4>
                  <p className="text-[#8B1E32]/55 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 text-center bg-[#E8E4D9]">
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#D91E36] text-xs tracking-[0.25em] uppercase font-semibold mb-6"
          >
            Let's Talk
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif text-[#D91E36] mb-10 leading-tight"
          >
            Ready to get started?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => onNavigate?.('contact')}
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#D91E36] text-white rounded-full hover:bg-[#B01830] transition-colors text-lg font-medium group shadow-lg shadow-[#D91E36]/20 hover:shadow-xl hover:shadow-[#D91E36]/30"
            >
              Start a project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}