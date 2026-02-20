import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

/* ─── Native replacements for shadcn Input / Textarea / Button ─── */
function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-[#D91E36]/20 focus:border-[#D91E36] focus:outline-none rounded-xl h-12 px-4 bg-[#E8E4D9]/30 text-[#8B1E32] placeholder:text-[#8B1E32]/30 text-sm transition-colors duration-200 ${className}`}
    />
  );
}

function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border border-[#D91E36]/20 focus:border-[#D91E36] focus:outline-none rounded-xl px-4 py-3 bg-[#E8E4D9]/30 text-[#8B1E32] placeholder:text-[#8B1E32]/30 text-sm transition-colors duration-200 resize-none ${className}`}
    />
  );
}

function Button({ className = '', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
}

/* ─── Contact page ───────────────────────────────────────────────── */
const SERVICES = [
  'Influencer Marketing',
  'Content Creation',
  'Email Campaigns',
  'Social Media',
  'Website Design',
  'Other',
];

const SOCIALS = [
  { label: 'IG', href: '#' },
  { label: 'X',  href: '#' },
  { label: 'TT', href: '#' },
  { label: 'YT', href: '#' },
  { label: 'FB', href: '#' },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface ContactPageProps {
  onNavigate?: (page: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', email: '',
    phone: '', service: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="bg-[#E8E4D9] min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] bg-[#D91E36] flex flex-col overflow-hidden">
        {/* noise texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
          }}
        />
        {/* large background word */}
        <div className="absolute right-4 bottom-10 text-white/[0.045] text-[12rem] md:text-[18rem] font-black font-serif leading-none select-none pointer-events-none">
          HI
        </div>

        {/* diagonal slice */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-[#E8E4D9] z-10"
          style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
        />

        <div className="flex-1 flex items-end pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full pt-36 relative z-[1]">
          <div className="grid md:grid-cols-2 gap-12 items-end w-full">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.95]"
            >
              Let's build
              <br />
              <span className="italic font-light">something great.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/65 text-lg leading-relaxed md:mb-2"
            >
              Have a project in mind? We'd love to hear about it. Drop us a message and we'll get back to you within 24 hours.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Contact Content ───────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-16">

          {/* ── Left: Info ───────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-12">

            {/* Contact details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#D91E36] text-xs tracking-[0.25em] uppercase font-semibold mb-8">
                Get in touch
              </p>
              <div className="space-y-8">
                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    content: (
                      <a href="mailto:hello@scalers.com" className="text-[#8B1E32] hover:text-[#D91E36] transition-colors font-medium">
                        hello@scalers.com
                      </a>
                    ),
                  },
                  {
                    icon: Phone,
                    label: 'Phone',
                    content: (
                      <a href="tel:+1234567890" className="text-[#8B1E32] hover:text-[#D91E36] transition-colors font-medium">
                        +1 (234) 567-890
                      </a>
                    ),
                  },
                  {
                    icon: MapPin,
                    label: 'Office',
                    content: (
                      <p className="text-[#8B1E32] font-medium">
                        123 Design Street<br />New York, NY 10001
                      </p>
                    ),
                  },
                ].map(({ icon: Icon, label, content }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#D91E36]/10 flex items-center justify-center shrink-0 mt-1">
                      <Icon className="w-4 h-4 text-[#D91E36]" />
                    </div>
                    <div>
                      <p className="text-[#8B1E32]/50 text-xs uppercase tracking-wider mb-1">{label}</p>
                      {content}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="border-t border-[#D91E36]/15" />

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              viewport={{ once: true }}
            >
              <p className="text-[#8B1E32]/50 text-xs uppercase tracking-wider mb-6">Follow us</p>
              <div className="flex gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="w-10 h-10 border border-[#D91E36]/30 rounded-full flex items-center justify-center text-[#D91E36] text-xs font-semibold hover:bg-[#D91E36] hover:text-white hover:border-[#D91E36] transition-all duration-200"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quote box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              viewport={{ once: true }}
              className="bg-[#D91E36] rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 text-white/10 text-8xl font-serif leading-none select-none">"</div>
              <p className="text-white/90 text-lg font-serif italic leading-relaxed relative z-10">
                "We don't just run campaigns — we build brands that last."
              </p>
              <p className="text-white/50 text-sm mt-4 relative z-10">— The SCALERS Team</p>
            </motion.div>
          </div>

          {/* ── Right: Form ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-12 shadow-sm"
          >
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-16 h-16 bg-[#D91E36]/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#D91E36]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-serif text-[#D91E36] mb-4">Message sent!</h3>
                <p className="text-[#8B1E32]/70">We'll be in touch within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ firstName:'', lastName:'', email:'', phone:'', service:'', message:'' }); }}
                  className="mt-8 text-[#D91E36] text-sm underline hover:text-[#B01830] transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-serif text-[#8B1E32] mb-8">Tell us about your project</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Name row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#8B1E32]/60 text-xs uppercase tracking-wider mb-2 block">First Name</label>
                      <Input
                        value={formData.firstName}
                        onChange={set('firstName')}
                        placeholder="Alex"
                      />
                    </div>
                    <div>
                      <label className="text-[#8B1E32]/60 text-xs uppercase tracking-wider mb-2 block">Last Name</label>
                      <Input
                        value={formData.lastName}
                        onChange={set('lastName')}
                        placeholder="Mercer"
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#8B1E32]/60 text-xs uppercase tracking-wider mb-2 block">
                        Email <span className="text-[#D91E36]">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={set('email')}
                        placeholder="hello@yourbrand.com"
                      />
                    </div>
                    <div>
                      <label className="text-[#8B1E32]/60 text-xs uppercase tracking-wider mb-2 block">Phone</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={set('phone')}
                        placeholder="+1 (234) 567-890"
                      />
                    </div>
                  </div>

                  {/* Service pills */}
                  <div>
                    <label className="text-[#8B1E32]/60 text-xs uppercase tracking-wider mb-3 block">
                      Service you're interested in
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, service: s }))}
                          className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                            formData.service === s
                              ? 'bg-[#D91E36] text-white border-[#D91E36] shadow-sm shadow-[#D91E36]/20'
                              : 'border-[#D91E36]/25 text-[#8B1E32] hover:border-[#D91E36] hover:text-[#D91E36]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[#8B1E32]/60 text-xs uppercase tracking-wider mb-2 block">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={set('message')}
                      rows={5}
                      placeholder="Tell us about your project, goals, and timeline..."
                      className="min-h-[130px]"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-[#D91E36] hover:bg-[#B01830] text-white rounded-full py-4 text-base gap-3 group shadow-lg shadow-[#D91E36]/15 hover:shadow-xl hover:shadow-[#D91E36]/25 hover:-translate-y-0.5"
                  >
                    Send Message
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <p className="text-center text-[#8B1E32]/35 text-xs">
                    We respond to every enquiry within 24 hours.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}