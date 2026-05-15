import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowRight, FiCode, FiZap, FiShield, FiStar, FiCheckCircle } from 'react-icons/fi';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { HeroAnimationClient } from '@/components/home/HeroAnimationClient';
import { HeroVisual } from '@/components/home/HeroVisual';
import { TechMarquee } from '@/components/home/TechMarquee';

export const metadata: Metadata = {
  title: 'Tech Bytes Design — Custom Web Development',
  description:
    'We build high-performance, visually stunning websites and web applications tailored for your business. Based in Srinagar, serving clients worldwide.',
};

const features = [
  { Icon: FiCode,   title: 'Clean Code',        description: 'Production-grade, maintainable code with modern frameworks. No page builders, no bloat.' },
  { Icon: FiZap,    title: 'Blazing Fast',       description: 'Optimized for Core Web Vitals. Server-side rendering, smart caching, and CDN delivery.' },
  { Icon: FiShield, title: 'Secure by Default',  description: 'Best-practice security at every layer — HTTPS, input validation, strict database rules.' },
  { Icon: FiStar,   title: 'SEO Ready',          description: 'Structured data, dynamic sitemaps, and meta optimization built in from day one.' },
];

const process = [
  {
    step: '01',
    title: 'Discover',
    description: 'We learn about your business, goals, and audience. No assumptions — just listening.',
    detail: 'Discovery call + project brief',
  },
  {
    step: '02',
    title: 'Design & Build',
    description: 'Your site is built from scratch with React & Next.js. Regular check-ins keep you in the loop.',
    detail: '~2–3 weeks, weekly updates',
  },
  {
    step: '03',
    title: 'Launch & Support',
    description: 'We deploy, hand over the code, and stay available for questions after launch.',
    detail: 'Full source code delivery',
  },
];

const stats = [
  { value: '~3 Wks', label: 'Avg. Delivery' },
  { value: '100%',   label: 'Custom Code' },
  { value: '0',      label: 'Templates Used' },
  { value: '∞',      label: 'Revisions Possible' },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_80%_70%_at_50%_-15%,rgba(124,58,237,0.28),transparent)]" />
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(ellipse_70%_60%_at_60%_10%,rgba(167,139,250,0.18),transparent)]" />

        {/* Decorative orbs */}
        <div className="orb-1 absolute top-1/3 -left-32 w-[500px] h-[500px] dark:bg-violet-600/8 bg-violet-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="orb-2 absolute bottom-0 right-0 w-[400px] h-[400px] dark:bg-blue-600/8 bg-blue-300/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] dark:opacity-[0.025] opacity-[0.035] pointer-events-none" />

        <HeroAnimationClient />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div>
              <span className="hero-tag inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-violet-600 dark:text-violet-300 text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                Available for new projects
              </span>

              <h1 className="hero-title text-5xl sm:text-6xl font-bold text-primary leading-[1.1] mb-6 tracking-tight">
                We Build{' '}
                <span className="gradient-text">Digital Experiences</span>{' '}
                That Convert
              </h1>

              <p className="hero-subtitle text-lg text-secondary leading-relaxed max-w-xl mb-10">
                Tech Bytes Design crafts custom websites and web apps with React & Next.js —
                pixel-perfect, performance-first, and delivered in weeks, not months.
              </p>

              <div className="hero-cta flex flex-wrap gap-3 mb-12">
                <Link
                  href="/request-development"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/25 text-sm"
                >
                  Start Your Project <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/projects"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl glass hover:border-theme-strong text-primary font-semibold transition-all duration-200 text-sm"
                >
                  View Our Work
                </Link>
              </div>

              {/* Stats row */}
              <div className="hero-stats grid grid-cols-4 gap-4 pt-8 border-t border-theme">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-xl sm:text-2xl font-bold text-primary">{s.value}</div>
                    <div className="text-xs text-muted mt-0.5 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — code card visual */}
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── Trusted Tech Stack ───────────────────────────────────────────────── */}
      <section className="py-12 border-y border-theme bg-page-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
          <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest">
            Built with modern, battle-tested technologies
          </p>
        </div>
        <TechMarquee />
      </section>

      {/* ── Why Us ───────────────────────────────────────────────────────────── */}
      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Why choose us</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Built different, by design</h2>
            <p className="text-muted max-w-xl mx-auto">
              We don't use templates. Every line of code is written for your project, your brand, your users.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ Icon, title, description }, i) => (
            <ScrollReveal key={title} delay={i * 0.08}>
              <div className="glass rounded-2xl p-6 h-full group hover:border-theme-strong hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center mb-5 group-hover:bg-violet-200 dark:group-hover:bg-violet-500/25 transition-colors">
                  <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="font-semibold text-primary mb-2 text-sm">{title}</h3>
                <p className="text-xs text-muted leading-relaxed">{description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-page-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">How we work</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Simple, transparent process</h2>
              <p className="text-muted max-w-xl mx-auto">
                No surprises. No scope creep. Just clear milestones and honest communication from day one.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-9 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-violet-500/0 via-violet-500/40 to-violet-500/0" />

            {process.map((p, i) => (
              <ScrollReveal key={p.step} delay={i * 0.12}>
                <div className="glass rounded-2xl p-7 relative group hover:border-theme-strong transition-colors">
                  {/* Step number circle */}
                  <div className="w-10 h-10 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center mb-5 shadow-lg shadow-violet-500/30 relative z-10">
                    {p.step}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{p.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-4">{p.description}</p>
                  <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 font-medium">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    {p.detail}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ────────────────────────────────────────────────── */}
      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">Portfolio</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">Featured Work</h2>
              <p className="text-muted text-sm">A selection of projects we're proud of.</p>
            </div>
            <Link
              href="/projects"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
            >
              All projects <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
        <FeaturedProjects />
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden brand-glow">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-700" />
            {/* Mesh overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.08]" />
            {/* Glow orbs inside banner */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10 px-8 py-14 sm:px-14 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Ready to build something great?
                </h2>
                <p className="text-white/70 text-sm max-w-md">
                  Tell us about your project. We'll respond within 24 hours with a tailored proposal — no obligation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/request-development"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-violet-700 font-semibold hover:bg-violet-50 transition-colors text-sm whitespace-nowrap"
                >
                  Request a Build <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors text-sm whitespace-nowrap"
                >
                  Just say hello
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
