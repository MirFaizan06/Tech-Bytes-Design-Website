import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiMapPin, FiMail, FiArrowRight } from 'react-icons/fi';
import { TeamSection } from './TeamSection';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Tech Bytes Design — our story, our team, our values, and what drives us to build exceptional web experiences.',
};

const values = [
  { title: 'Quality over quantity', description: 'We take on a limited number of projects to ensure each one gets our full attention.' },
  { title: 'Transparent communication', description: 'Weekly updates, clear timelines, and honest estimates — no surprises.' },
  { title: 'Modern by default', description: 'We exclusively use current, actively maintained technologies — no legacy stacks.' },
  { title: 'Results-oriented', description: 'We measure success by your business goals, not just lines of code delivered.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          About <span className="gradient-text">Tech Bytes Design</span>
        </h1>
        <p className="text-white/50 max-w-2xl mx-auto text-lg">
          A boutique web development studio dedicated to building fast, beautiful, and functional digital products.
        </p>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Our Story</h2>
          <div className="space-y-4 text-white/60 leading-relaxed">
            <p>
              Tech Bytes Design was founded by Mir Faizan with a simple belief: every business deserves a website
              that actually works — one that's fast, accessible, and converts visitors into customers.
            </p>
            <p>
              Based in Srinagar, Kashmir, we serve clients globally. Our focus on the React ecosystem
              (Next.js, TypeScript, Tailwind) lets us deliver production-grade applications that are maintainable
              long after the project ends.
            </p>
            <p>
              We believe in radical transparency — you'll always know where your project stands, what it costs,
              and what comes next. No hidden fees, no surprises.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm text-white/50">
              <FiMapPin className="text-violet-400 w-4 h-4 shrink-0" />
              Wadera Estates, Lalchowk, Srinagar, J&K — 190001
            </div>
            <div className="flex items-center gap-3 text-sm text-white/50">
              <FiClock className="text-violet-400 w-4 h-4 shrink-0" />
              Mon–Thu & Sat, 10:00 AM – 4:00 PM IST
            </div>
            <div className="flex items-center gap-3 text-sm text-white/50">
              <FiMail className="text-violet-400 w-4 h-4 shrink-0" />
              <a href="mailto:techbytesdesign@gmail.com" className="hover:text-white transition-colors">
                techbytesdesign@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden glass h-80 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-blue-900/20" />
          <div className="relative z-10 text-center">
            <div className="text-6xl font-black gradient-text mb-2">TBD</div>
            <div className="text-white/40 text-sm">Tech Bytes Design</div>
            <div className="text-white/20 text-xs mt-1">Srinagar · India</div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v) => (
            <div key={v.title} className="glass rounded-2xl p-6 hover:border-violet-500/30 transition-colors">
              <h3 className="font-semibold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">The Team</h2>
        <TeamSection />
      </div>

      {/* CTA */}
      <div className="glass rounded-3xl p-10 text-center border border-violet-500/20">
        <h2 className="text-2xl font-bold text-white mb-3">Let's work together</h2>
        <p className="text-white/50 mb-6">Have a project in mind? We'd love to hear about it.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/request-development"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
          >
            Start a Project <FiArrowRight />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 text-white font-semibold transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
