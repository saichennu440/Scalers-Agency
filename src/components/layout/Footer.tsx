import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';
import { Page } from '../../lib/types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNav = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0f0f0f] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <button onClick={() => handleNav('home')} className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 flex items-center justify-center">
                        <svg viewBox="0 0 40 40" className="w-full h-full">
                            <polygon points="20,5 35,35 20,25 5,35" fill="#D91E36" opacity="0.5" />
                            <polygon points="20,5 35,35 32,33 20,25 20,24" fill="#D91E36" />
                        </svg>
            </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-white tracking-widest">SCALERS</span>
                <span className="text-[9px] tracking-[0.1em] font-light text-white/60">BUSINESS AGENCY</span>
              </div>
            </button>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              We help ambitious businesses scale through strategic marketing, bold branding, and data-driven growth solutions that deliver measurable results.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Linkedin, target:"_blank", href: 'https://www.linkedin.com/company/scalers-agency-business/posts/?feedView=all' },
                { Icon: Instagram, target:"_blank", href: 'https://www.instagram.com/scalersbusinessagency/' },
                { Icon: Facebook, target:"_blank", href: 'https://www.facebook.com/p/Scalers-business-agency-61563946187497/' },
              ].map(({ Icon, href, target }, i) => (
                <a
                  key={i}
                  href={href}
                  target={target}
                  className="w-9 h-9 rounded-sm bg-white/10 flex items-center justify-center hover:bg-[#C8102E] transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', page: 'home' as Page },
                { label: 'About Us', page: 'about' as Page },
                { label: 'Services', page: 'services' as Page },
                { label: 'Clients', page: 'clients' as Page },
                { label: 'Contact', page: 'contact' as Page },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => handleNav(page)}
                    className="text-sm text-gray-400 hover:text-[#C8102E] transition-colors duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C8102E] mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">ICP 800 Jubilee <br/>Plot number 800, Road No. 36, near metro pillar no. C1669, CBI Colony, Jubilee Hills<br /> Hyderabad, Telangana 500033</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#C8102E] shrink-0" />
                <span className="text-sm text-gray-400">+91 9876543210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#C8102E] shrink-0" />
                <span className="text-sm text-gray-400">scalersbusinessagency@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Scalers Business Agency. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
