import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
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

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
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
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#D91E36]/6 blur-3xl pointer-events-none" />
        {/* Watermark */}
        <div className="absolute right-6 bottom-6 text-white/[0.03] text-[10rem] font-black font-serif leading-none select-none pointer-events-none">
          TERMS
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
              <FileText size={17} className="text-[#D91E36]" />
            </div>
            <span className="text-white/35 text-xs font-bold tracking-[0.28em] uppercase">Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-white text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-5"
          >
            Terms of<br /><span className="italic font-light text-white/70">Service.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/40 text-sm leading-relaxed max-w-lg"
          >
            Last updated: {LAST_UPDATED}. Please read these terms carefully before engaging our services or using our website.
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
            These Terms of Service ("Terms") govern your use of the website and services provided by <strong className="text-[#8B1E32] font-semibold">Scalers Business Agency</strong> ("we", "us", or "our"). By accessing our website or engaging our services, you agree to be bound by these Terms. If you do not agree, please discontinue use immediately.
          </p>
        </motion.div>

        <Section title="1. Services">
          <p>Scalers Business Agency provides digital marketing, content creation, social media management, video production, branding, and related creative services ("Services") to businesses and individuals ("Clients").</p>
          <p className="mt-3">The specific scope, deliverables, timelines, and fees for each engagement are defined in a separate <strong className="text-[#8B1E32]/80">Proposal</strong> or <strong className="text-[#8B1E32]/80">Service Agreement</strong> agreed upon between Scalers and the Client. These Terms apply in addition to, and do not replace, any such agreement.</p>
        </Section>

        <Section title="2. Use of Our Website">
          <p>You agree to use our website only for lawful purposes. You must not:</p>
          <ul className="space-y-2 mt-2">
            <Li>Use the site in any way that violates applicable local, national, or international laws or regulations.</Li>
            <Li>Transmit any unsolicited or unauthorised advertising or promotional material.</Li>
            <Li>Attempt to gain unauthorised access to any part of our website or its underlying systems.</Li>
            <Li>Reproduce, duplicate, or exploit any portion of our website without our express written permission.</Li>
            <Li>Engage in any conduct that could damage, disable, or impair our website or servers.</Li>
          </ul>
        </Section>

        <Section title="3. Intellectual Property">
          <p><strong className="text-[#8B1E32]/80">Our content:</strong> All content on this website — including text, graphics, logos, images, and videos — is the property of Scalers Business Agency and is protected by applicable copyright and intellectual property laws. You may not reproduce or distribute it without prior written consent.</p>
          <p className="mt-3"><strong className="text-[#8B1E32]/80">Client deliverables:</strong> Upon receipt of full payment, ownership of bespoke creative deliverables produced for a Client transfers to the Client as specified in the relevant Service Agreement. Scalers retains the right to display such work in our portfolio unless otherwise agreed in writing.</p>
          <p className="mt-3"><strong className="text-[#8B1E32]/80">Third-party assets:</strong> Any licensed third-party assets (fonts, stock imagery, music) used in deliverables are subject to the terms of their respective licences. We will communicate any licensing restrictions at the time of delivery.</p>
        </Section>

        <Section title="4. Payment Terms">
          <p>Unless otherwise specified in a Service Agreement:</p>
          <ul className="space-y-2 mt-2">
            <Li>A <strong className="text-[#8B1E32]/80">50% deposit</strong> is required before work commences on any project.</Li>
            <Li>The remaining balance is due upon project completion and prior to final file delivery.</Li>
            <Li>Invoices are payable within <strong className="text-[#8B1E32]/80">14 days</strong> of the invoice date unless otherwise agreed.</Li>
            <Li>Late payments may incur interest at a rate of 2% per month on the outstanding balance.</Li>
            <Li>We reserve the right to suspend work on any project where payment is overdue.</Li>
          </ul>
          <p className="mt-3">All prices are quoted exclusive of applicable taxes unless stated otherwise.</p>
        </Section>

        <Section title="5. Revisions & Scope">
          <p>Each project proposal includes a defined number of revision rounds. Additional revisions or changes to the agreed scope may incur additional charges, which will be communicated and agreed upon before work proceeds.</p>
          <p className="mt-3">Significant changes to project scope after work has commenced may require a revised proposal and timeline. We will always discuss scope changes with you transparently before proceeding.</p>
        </Section>

        <Section title="6. Turnaround Times & Delays">
          <p>Estimated timelines are provided in good faith and depend on timely receipt of required materials, feedback, and approvals from the Client. Scalers is not liable for delays caused by:</p>
          <ul className="space-y-2 mt-2">
            <Li>Late provision of content, assets, or feedback by the Client.</Li>
            <Li>Circumstances beyond our reasonable control (force majeure).</Li>
            <Li>Changes to project scope requested after commencement.</Li>
          </ul>
        </Section>

        <Section title="7. Client Responsibilities">
          <p>To enable us to deliver our best work, Clients agree to:</p>
          <ul className="space-y-2 mt-2">
            <Li>Provide accurate and complete information required for the project.</Li>
            <Li>Ensure all materials supplied to Scalers (text, images, branding, etc.) are owned by the Client or properly licensed for use.</Li>
            <Li>Review and provide feedback on drafts within the agreed timeframe.</Li>
            <Li>Designate a primary point of contact for the project.</Li>
          </ul>
          <p className="mt-3">Scalers is not responsible for any legal issues arising from inaccurate information or unlicensed materials provided by the Client.</p>
        </Section>

        <Section title="8. Confidentiality">
          <p>Both parties agree to keep confidential any proprietary or sensitive information shared during the course of an engagement. This includes business strategies, unpublished content, financial data, and client lists.</p>
          <p className="mt-3">This obligation does not apply to information that is publicly available, independently developed, or required to be disclosed by law.</p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>To the maximum extent permitted by law, Scalers Business Agency shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:</p>
          <ul className="space-y-2 mt-2">
            <Li>Use of or inability to use our website or services.</Li>
            <Li>Any errors or omissions in content we produce.</Li>
            <Li>Unauthorised access to or alteration of your data.</Li>
            <Li>Any third-party conduct or content.</Li>
          </ul>
          <p className="mt-3">Our total liability in any matter arising from or related to our services shall not exceed the total amount paid by the Client for the specific service giving rise to the claim.</p>
        </Section>

        <Section title="10. Termination">
          <p>Either party may terminate a project or engagement by providing written notice. Upon termination:</p>
          <ul className="space-y-2 mt-2">
            <Li>The Client is liable for payment of all work completed up to the termination date.</Li>
            <Li>Any deposit paid is non-refundable unless Scalers is unable to commence the agreed work.</Li>
            <Li>Scalers will deliver all completed work product upon receipt of payment for work done.</Li>
          </ul>
        </Section>

        <Section title="11. Governing Law">
          <p>These Terms are governed by and construed in accordance with applicable law. Any disputes arising from these Terms or our services shall first be attempted to be resolved through good-faith negotiation between the parties.</p>
          <p className="mt-3">If a dispute cannot be resolved amicably, it shall be submitted to the exclusive jurisdiction of the courts of the applicable territory.</p>
        </Section>

        <Section title="12. Changes to These Terms">
          <p>We reserve the right to update these Terms at any time. Changes will be posted on this page with a revised "Last updated" date. Continued use of our website or services after changes are posted constitutes acceptance of the updated Terms.</p>
          <p className="mt-3">For existing client engagements, material changes to terms will be communicated directly.</p>
        </Section>

        <Section title="13. Contact Us">
          <p>If you have questions about these Terms or wish to discuss any aspect of your engagement with us, please contact:</p>
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