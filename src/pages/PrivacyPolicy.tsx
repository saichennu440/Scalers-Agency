import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

const LAST_UPDATED = 'February 2026';

/* ── Reusable section block ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1 h-6 rounded-full bg-[#D91E36] shrink-0" />
        <h2 className="font-serif text-[#8B1E32] text-2xl leading-snug">{title}</h2>
      </div>
      <div className="pl-4 border-l border-[#D91E36]/10 space-y-3 text-[#8B1E32]/65 text-[15px] leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#D91E36]/50 mt-[7px] shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-[#E8E4D9]">

      {/* ── Hero ── */}
      <section className="relative bg-[#D91E36] overflow-hidden">
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }} />
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#D91E36]/6 blur-3xl pointer-events-none" />
        {/* Watermark */}
        <div className="absolute right-6 bottom-6 text-white/[0.03] text-[11rem] font-black font-serif leading-none select-none pointer-events-none">
          PRIVACY
        </div>
        {/* Cream wedge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#E8E4D9]" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-36 pb-24">
          {/* Back button */}
          {onBack && (
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onBack}
              className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-semibold uppercase tracking-widest mb-10 transition-colors duration-200 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
              Back
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-9 h-9 rounded-lg bg-[#D91E36]/15 border border-[#D91E36]/25 flex items-center justify-center">
              <Shield size={17} className="text-[#D91E36]" />
            </div>
            <span className="text-white/35 text-xs font-bold tracking-[0.28em] uppercase">Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-white text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-5"
          >
            Privacy<br /><span className="italic font-light text-white/70">Policy.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/40 text-sm leading-relaxed max-w-lg"
          >
            Last updated: {LAST_UPDATED}. This policy describes how Scalers Business Agency collects, uses, and protects your information.
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">

        {/* Intro card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/60 border border-[#D91E36]/10 rounded-2xl p-7 mb-14 shadow-sm"
        >
          <p className="text-[#8B1E32]/70 text-[15px] leading-relaxed">
            At <strong className="text-[#8B1E32] font-semibold">Scalers Business Agency</strong>, we are committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your personal data. By using our website or services, you agree to the terms outlined below.
          </p>
        </motion.div>

        <Section title="1. Information We Collect">
          <p>We may collect the following types of information:</p>
          <ul className="space-y-2 mt-2">
            <Li><strong className="text-[#8B1E32]/80">Contact Information:</strong> Name, email address, phone number, and company name when you fill out our contact or inquiry forms.</Li>
            <Li><strong className="text-[#8B1E32]/80">Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and referral sources — collected via analytics tools.</Li>
            <Li><strong className="text-[#8B1E32]/80">Communications:</strong> Messages and correspondence you send us through forms, email, or other channels.</Li>
            <Li><strong className="text-[#8B1E32]/80">Technical Data:</strong> IP address, browser type, device type, and operating system for security and performance purposes.</Li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="space-y-2 mt-2">
            <Li>Respond to your enquiries and provide the services you request.</Li>
            <Li>Send project updates, invoices, and relevant communications related to our engagement.</Li>
            <Li>Improve our website, services, and client experience through analytics.</Li>
            <Li>Comply with legal obligations and protect against fraudulent or unlawful activity.</Li>
            <Li>Send occasional updates or promotional materials — only with your explicit consent.</Li>
          </ul>
          <p className="mt-3">We do <strong className="text-[#8B1E32]/80">not</strong> sell, rent, or trade your personal information to third parties.</p>
        </Section>

        <Section title="3. Cookies & Tracking">
          <p>Our website may use cookies and similar tracking technologies to:</p>
          <ul className="space-y-2 mt-2">
            <Li>Remember your preferences and improve your browsing experience.</Li>
            <Li>Analyse site traffic and usage patterns via tools like Google Analytics.</Li>
            <Li>Support marketing efforts (only where consent has been given).</Li>
          </ul>
          <p className="mt-3">You may disable cookies through your browser settings at any time. Disabling cookies may affect some features of the website.</p>
        </Section>

        <Section title="4. Data Sharing & Third Parties">
          <p>We may share your data with trusted third parties only where necessary:</p>
          <ul className="space-y-2 mt-2">
            <Li><strong className="text-[#8B1E32]/80">Service Providers:</strong> Hosting providers, analytics platforms, and communication tools used to operate our business (e.g., Supabase, Google Analytics).</Li>
            <Li><strong className="text-[#8B1E32]/80">Legal Requirements:</strong> When required by law, court order, or to protect the rights and safety of Scalers or others.</Li>
            <Li><strong className="text-[#8B1E32]/80">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction.</Li>
          </ul>
          <p className="mt-3">All third parties we work with are required to handle your data securely and in accordance with applicable privacy laws.</p>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your personal data only for as long as necessary to fulfil the purposes described in this policy, or as required by law. When data is no longer needed, we securely delete or anonymise it.</p>
          <p className="mt-3">Client project data may be retained for up to <strong className="text-[#8B1E32]/80">7 years</strong> for accounting and legal compliance purposes.</p>
        </Section>

        <Section title="6. Security">
          <p>We take reasonable technical and organisational measures to protect your information from unauthorised access, loss, or disclosure. These include:</p>
          <ul className="space-y-2 mt-2">
            <Li>Encrypted data transmission (HTTPS/TLS).</Li>
            <Li>Access controls limiting who can view personal data internally.</Li>
            <Li>Regular review of our data security practices.</Li>
          </ul>
          <p className="mt-3">However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and keep your credentials confidential.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="space-y-2 mt-2">
            <Li><strong className="text-[#8B1E32]/80">Access:</strong> Request a copy of the personal data we hold about you.</Li>
            <Li><strong className="text-[#8B1E32]/80">Correction:</strong> Request that inaccurate or incomplete data be updated.</Li>
            <Li><strong className="text-[#8B1E32]/80">Deletion:</strong> Request that your data be erased, subject to legal obligations.</Li>
            <Li><strong className="text-[#8B1E32]/80">Objection:</strong> Object to the processing of your data for marketing purposes.</Li>
            <Li><strong className="text-[#8B1E32]/80">Portability:</strong> Request your data in a structured, machine-readable format.</Li>
          </ul>
          <p className="mt-3">To exercise any of these rights, please contact us at the details below. We will respond within 30 days.</p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>Our website and services are not directed at individuals under the age of 16. We do not knowingly collect personal data from children. If you believe we have inadvertently collected such information, please contact us immediately and we will delete it.</p>
        </Section>

        <Section title="9. Third-Party Links">
          <p>Our website may contain links to external websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policy of any third-party website you visit.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated version will be posted on this page with a revised "Last updated" date. We encourage you to review this policy periodically.</p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:</p>
          <div className="mt-4 p-5 bg-white/50 border border-[#D91E36]/10 rounded-xl space-y-1.5">
            <p><strong className="text-[#8B1E32]/80">Scalers Business Agency</strong></p>
            <p>Email: <a href="mailto:scalersbusinessagency@gmail.com" className="text-[#D91E36] hover:underline">scalersbusinessagency@gmail.com</a></p>
            <p>We aim to respond to all enquiries within 2 business days.</p>
          </div>
        </Section>

        {/* Bottom divider */}
        <div className="border-t border-[#D91E36]/10 pt-10 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[#8B1E32]/30 text-xs">© {new Date().getFullYear()} Scalers Business Agency. All rights reserved.</p>
          <p className="text-[#8B1E32]/30 text-xs">Last updated: {LAST_UPDATED}</p>
        </div>

      </div>
    </div>
  );
}