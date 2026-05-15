import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiDownload, FiFileText } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { LEGAL_DEFAULTS } from '@/lib/legalDefaults';

interface Props {
  params: Promise<{ type: string }>;
}

const typeLabels: Record<string, string> = {
  terms:   'Terms of Service',
  privacy: 'Privacy Policy',
  refund:  'Refund Policy',
};

const typeDescriptions: Record<string, string> = {
  terms:   'The rules and conditions that govern your use of our services.',
  privacy: 'How we handle and protect your personal information.',
  refund:  'Our policy on cancellations and refunds for development services.',
};

async function getLegal(type: string): Promise<{ content: string; pdfUrl?: string } | null> {
  const fallback = LEGAL_DEFAULTS[type];

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const { db } = await import('@/lib/firebaseAdmin');
      const snap = await db.collection('legals').where('type', '==', type).limit(1).get();
      if (!snap.empty) {
        const data = snap.docs[0].data();
        return { content: data.content ?? fallback ?? '', pdfUrl: data.pdfUrl };
      }
    } catch {}
  }

  if (fallback) return { content: fallback };
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  return {
    title: typeLabels[type] ?? 'Legal Document',
    description: typeDescriptions[type] ?? 'Legal document for Tech Bytes Design services.',
  };
}

export default async function LegalPage({ params }: Props) {
  const { type } = await params;
  if (!typeLabels[type]) notFound();

  const legal = await getLegal(type);
  if (!legal) notFound();

  const otherDocs = Object.entries(typeLabels).filter(([k]) => k !== type);

  return (
    <div className="bg-page min-h-screen">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="border-b border-theme bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
          {legal.pdfUrl && (
            <a
              href={legal.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:border-theme-strong text-sm text-secondary hover:text-primary transition-all"
            >
              <FiDownload className="w-3.5 h-3.5" />
              Download PDF
            </a>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 items-start">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 space-y-8">
            {/* Current doc info */}
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center mb-4">
                <FiFileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-xl font-bold text-primary mb-2">{typeLabels[type]}</h1>
              <p className="text-sm text-muted leading-relaxed">{typeDescriptions[type]}</p>
            </div>

            {/* Other docs */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Other policies</p>
              <nav className="space-y-1">
                {otherDocs.map(([k, label]) => (
                  <Link
                    key={k}
                    href={`/legals/${k}`}
                    className="block px-3 py-2.5 rounded-lg text-sm text-secondary hover:text-primary hover:bg-surface-hover transition-all"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact callout */}
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-muted leading-relaxed">
                Questions about these policies?
              </p>
              <a
                href="mailto:techbytesdesign@gmail.com"
                className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline mt-1 block"
              >
                techbytesdesign@gmail.com
              </a>
            </div>
          </aside>

          {/* ── Document body ─────────────────────────────────────────────── */}
          <article>
            {/* Effective date pill */}
            <div className="flex items-center gap-2 mb-8">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300">
                Effective May 2026
              </span>
            </div>

            {/* Content */}
            <div className="
              prose dark:prose-invert max-w-none

              prose-h1:text-2xl prose-h1:font-bold prose-h1:text-primary prose-h1:mb-2 prose-h1:pb-4 prose-h1:border-b prose-h1:border-theme

              prose-h2:text-base prose-h2:font-bold prose-h2:text-primary prose-h2:mt-10 prose-h2:mb-3
              prose-h2:pb-2 prose-h2:border-b prose-h2:border-theme

              prose-h3:text-sm prose-h3:font-semibold prose-h3:text-secondary prose-h3:mt-6 prose-h3:mb-2

              prose-p:text-secondary prose-p:leading-relaxed prose-p:text-sm prose-p:my-3

              prose-li:text-secondary prose-li:text-sm prose-li:leading-relaxed prose-li:my-1

              prose-strong:text-primary prose-strong:font-semibold

              prose-a:text-violet-600 dark:prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline

              prose-hr:border-theme prose-hr:my-8

              prose-ul:space-y-1 prose-ol:space-y-1

              prose-blockquote:border-l-violet-400 prose-blockquote:bg-violet-50 dark:prose-blockquote:bg-violet-500/10
              prose-blockquote:rounded-r-xl prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:not-italic
            ">
              <ReactMarkdown>{legal.content}</ReactMarkdown>
            </div>

            {/* Bottom navigation */}
            <div className="mt-14 pt-8 border-t border-theme flex items-center justify-between gap-4 flex-wrap">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to home
              </Link>
              <div className="flex gap-4">
                {otherDocs.map(([k, label]) => (
                  <Link
                    key={k}
                    href={`/legals/${k}`}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
