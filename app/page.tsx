import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowRight, FiCode, FiZap, FiShield, FiStar } from 'react-icons/fi';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { HeroAnimationClient } from '@/components/home/HeroAnimationClient';

export const metadata: Metadata = {
  title: 'Tech Bytes Design — Custom Web Development',
  description:
    'We build high-performance, visually stunning websites and web applications tailored for your business. Based in Srinagar, serving clients worldwide.',
};

const stats = [
  { value: '3 Weeks', label: 'Avg. Delivery' },
  { value: '100%', label: 'Custom Code' },
  { value: 'React', label: 'Powered By' },
  { value: '24/7', label: 'Project Support' },
];

const features = [
  {
    Icon: FiCode,
    title: 'Clean Code',
    description: 'Production-grade, maintainable code with modern frameworks. No page builders, no bloat.',
  },
  {
    Icon: FiZap,
    title: 'Blazing Fast',
    description: 'Optimized for Core Web Vitals. Server-side rendering, smart caching, and CDN delivery.',
  },
  {
    Icon: FiShield,
    title: 'Secure by Default',
    description: 'Best-practice security at every layer — HTTPS, input validation, firestore rules.',
  },
  {
    Icon: FiStar,
    title: 'SEO Ready',
    description: 'Structured data, dynamic sitemaps, and meta optimization built in from day one.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.3),rgba(6,6,17,0))]" />
        <div className="orb-1 absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="orb-2 absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

        <HeroAnimationClient />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-4xl">
            <span className="hero-tag inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/30 text-violet-300 text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Available for new projects
            </span>

            <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              We Build{' '}
              <span className="gradient-text">Digital Experiences</span>{' '}
              That Convert
            </h1>

            <p className="hero-subtitle text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl mb-10">
              Tech Bytes Design crafts custom websites and web apps with React & Next.js.
              From concept to deployment in ~3 weeks, with pixel-perfect attention to detail.
            </p>

            <div className="hero-cta flex flex-wrap gap-4">
              <Link
                href="/request-development"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/30"
              >
                Start Your Project <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl glass hover:bg-white/10 text-white font-semibold transition-all duration-200"
              >
                View Our Work
              </Link>
            </div>

            <div className="hero-stats flex flex-wrap gap-8 mt-14">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-white/40 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Tech Bytes Design?</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              We don't use templates. Every project is hand-crafted to match your brand and business goals.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ Icon, title, description }, i) => (
            <ScrollReveal key={title} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 h-full group hover:border-violet-500/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center mb-4 group-hover:bg-violet-500/25 transition-colors">
                  <Icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Featured Work</h2>
              <p className="text-white/50">A selection of projects we're proud of.</p>
            </div>
            <Link
              href="/projects"
              className="hidden sm:flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors text-sm font-medium"
            >
              All projects <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
        <FeaturedProjects />
      </section>

      {/* CTA Section */}
      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden glass border border-violet-500/20 p-12 text-center brand-glow">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to build something great?
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                Tell us about your project. We'll respond within 24 hours with a tailored proposal.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/request-development"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/30"
                >
                  Request Development <FiArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl glass hover:bg-white/10 text-white font-semibold transition-all duration-200"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
