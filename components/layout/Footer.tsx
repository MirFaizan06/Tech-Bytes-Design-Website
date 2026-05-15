import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/request-development', label: 'Services & Pricing' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/legals/terms', label: 'Terms of Service' },
  { href: '/legals/privacy', label: 'Privacy Policy' },
  { href: '/legals/refund', label: 'Refund Policy' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo.svg" alt="Tech Bytes Design" width={36} height={36} />
              <span className="text-xl font-bold text-white">Tech Bytes Design</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Building elegant, high-performance web experiences for businesses that demand quality.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: FiGithub, href: '#', label: 'GitHub' },
                { Icon: FiLinkedin, href: '#', label: 'LinkedIn' },
                { Icon: FiTwitter, href: '#', label: 'Twitter' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white hover:border-violet-500/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/40">
                <FiMail className="w-4 h-4 mt-0.5 shrink-0 text-violet-400" />
                <a href="mailto:techbytesdesign@gmail.com" className="hover:text-white transition-colors">
                  techbytesdesign@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/40">
                <FiPhone className="w-4 h-4 mt-0.5 shrink-0 text-violet-400" />
                <a href="tel:+919596524832" className="hover:text-white transition-colors">
                  +91 95965 24832
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/40">
                <FiMapPin className="w-4 h-4 mt-0.5 shrink-0 text-violet-400" />
                <span>Srinagar, J&K, 190001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Tech Bytes Design. All rights reserved.
          </p>
          <div className="flex gap-4">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
