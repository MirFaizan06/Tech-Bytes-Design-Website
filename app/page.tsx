import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { HeroAnimationClient } from '@/components/home/HeroAnimationClient';
import { HeroVisual } from '@/components/home/HeroVisual';
import { TechMarquee } from '@/components/home/TechMarquee';

export const metadata: Metadata = {
  title: 'Tech Bytes Design — Custom Web Development',
  description: 'We build high-performance, visually stunning websites and web applications. Based in Srinagar, serving clients worldwide.',
};

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_60%_60%_at_65%_40%,rgba(124,58,237,0.18),transparent)]" />
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(ellipse_60%_60%_at_65%_40%,rgba(167,139,250,0.14),transparent)]" />
        <div className="orb-1 absolute -top-20 -left-20 w-[480px] h-[480px] dark:bg-violet-600/[0.06] bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] dark:opacity-[0.02] opacity-[0.03] pointer-events-none" />
        <HeroAnimationClient />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              {/* Eyebrow — plain, no badge gimmick */}
              <p className="text-sm font-medium text-muted mb-5 tracking-wide">
                Web development studio — Srinagar, India
              </p>

              <h1 className="hero-title font-bold text-primary leading-[1.05] mb-7 tracking-tight"
                  style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}>
                We design and build websites that{' '}
                <em className="not-italic gradient-text">actually work</em>{' '}
                for your business.
              </h1>

              <p className="hero-subtitle text-base text-secondary leading-[1.75] max-w-lg mb-10">
                Custom-coded with React & Next.js. No templates, no drag-and-drop builders.
                Fast, accessible, and ready in about three weeks.
              </p>

              <div className="hero-cta flex flex-wrap items-center gap-3 mb-12">
                <Link
                  href="/request-development"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-px"
                >
                  Start a project <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass hover:border-theme-strong text-primary font-semibold text-sm transition-all hover:-translate-y-px"
                >
                  See our work
                </Link>
              </div>

              {/* Trust signals — left aligned, no card wrapper */}
              <div className="hero-stats flex flex-col gap-2">
                {[
                  'Delivered in ~3 weeks, always',
                  '100% custom code — zero templates',
                  'Source code handed over on completion',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2.5 text-sm text-secondary">
                    <FiCheckCircle className="w-4 h-4 text-violet-500 shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── Tech stack strip ──────────────────────────────────────────────── */}
      <div className="border-y border-theme py-10 bg-page-subtle overflow-hidden">
        <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-6">
          Built with proven, modern technology
        </p>
        <TechMarquee />
      </div>

      {/* ── What we do — asymmetric split ─────────────────────────────────── */}
      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left sticky label column */}
          <ScrollReveal className="lg:col-span-4 lg:sticky lg:top-28">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-4">What we do</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary leading-tight mb-5">
              Everything you need to go live.
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-8">
              From the first wireframe sketch to the final DNS switch — we handle the whole technical side so you can focus on your business.
            </p>
            <Link
              href="/request-development"
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors"
            >
              See pricing <FiArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          {/* Right — vertical list, not a grid */}
          <div className="lg:col-span-8 space-y-px">
            {[
              {
                num: '01',
                title: 'Performance-first development',
                body: 'Every site scores 90+ on Core Web Vitals out of the box. We use server-side rendering, edge caching, and optimised images — not plugins.',
              },
              {
                num: '02',
                title: 'Design that earns trust',
                body: 'Clean, purposeful interfaces. No trends for the sake of it. Layouts that guide visitors toward the action that matters for your business.',
              },
              {
                num: '03',
                title: 'Built to scale',
                body: 'Need to add a blog, booking system, or e-commerce later? The codebase is structured for it. You won\'t need to rebuild from scratch.',
              },
              {
                num: '04',
                title: 'You own everything',
                body: 'Full source code delivered on completion. No proprietary lock-in, no ongoing platform fees. It\'s yours completely.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.num} delay={i * 0.05}>
                <div className="group flex gap-6 p-7 rounded-2xl hover:bg-surface-hover border border-transparent hover:border-theme transition-all duration-200 cursor-default">
                  <span className="text-3xl font-black text-faint group-hover:text-violet-200 dark:group-hover:text-violet-900 transition-colors font-mono leading-none mt-1 select-none">
                    {item.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process — horizontal timeline ─────────────────────────────────── */}
      <section className="section-padding bg-page-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-14">
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Process</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary">How a project unfolds</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            {/* Progress line */}
            <div className="hidden md:block absolute top-6 left-[calc(100%/6)] right-[calc(100%/6)] h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

            {[
              { step: 1, title: 'Understand', sub: 'Week 0', text: 'We listen. A short call to map your goals, users, and constraints. No assumptions, no cookie-cutter proposals.' },
              { step: 2, title: 'Build', sub: 'Weeks 1–3', text: 'Development begins with frequent check-ins. You see progress early — not just a big reveal at the end.' },
              { step: 3, title: 'Launch', sub: 'Week 3+', text: 'We deploy, verify, and hand over the source code. Support is available afterwards — no cliff-edge endings.' },
            ].map((p, i) => (
              <ScrollReveal key={p.step} delay={i * 0.1}>
                <div className="flex flex-col items-start md:items-center text-left md:text-center px-4 md:px-8 pb-8 md:pb-0 relative">
                  {/* Step indicator */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-600 text-white font-bold text-sm mb-5 shadow-md shadow-violet-500/25 relative z-10">
                    {p.step}
                  </div>
                  <div className="mb-1">
                    <span className="text-xs text-muted font-medium">{p.sub}</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{p.title}</h3>
                  <p className="text-sm text-muted leading-relaxed max-w-xs">{p.text}</p>

                  {/* Mobile connector */}
                  {i < 2 && (
                    <div className="md:hidden w-px h-8 bg-violet-400/30 mt-6" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Work ─────────────────────────────────────────────────── */}
      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">Work</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary">Selected projects</h2>
            </div>
            <Link
              href="/projects"
              className="self-start sm:self-auto text-sm font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
            >
              All projects <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
        <FeaturedProjects />
      </section>

      {/* ── CTA — full-bleed, editorial ───────────────────────────────────── */}
      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700 px-8 py-16 sm:px-16 brand-glow">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06]" />
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full blur-2xl" />

            <div className="relative z-10 max-w-2xl">
              <p className="text-violet-200 text-sm font-medium mb-4 uppercase tracking-widest">Ready when you are</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                Tell us about your project.
              </h2>
              <p className="text-violet-100/80 mb-9 leading-relaxed">
                We'll respond within 24 hours with a straight-to-the-point proposal.
                No sales deck, no pressure.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/request-development"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-violet-50 transition-colors hover:-translate-y-px shadow-sm"
                >
                  Request a build <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
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
