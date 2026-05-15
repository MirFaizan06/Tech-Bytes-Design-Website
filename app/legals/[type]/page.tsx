import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import { db as adminDb } from '@/lib/firebaseAdmin';
import ReactMarkdown from 'react-markdown';

interface Props {
  params: Promise<{ type: string }>;
}

async function getLegal(type: string) {
  const snap = await adminDb.collection('legals').where('type', '==', type).limit(1).get();
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
}

const typeLabels: Record<string, string> = {
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  refund: 'Refund Policy',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  return { title: typeLabels[type] ?? 'Legal Document' };
}

export default async function LegalPage({ params }: Props) {
  const { type } = await params;
  const legal = await getLegal(type);
  if (!legal) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm">
        <FiArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">{typeLabels[type] ?? legal.type}</h1>
        {legal.pdfUrl && (
          <a
            href={legal.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-sm text-white transition-colors"
          >
            <FiDownload className="w-4 h-4" /> Download PDF
          </a>
        )}
      </div>

      <div className="glass rounded-2xl p-8 prose prose-invert max-w-none prose-p:text-white/60 prose-headings:text-white prose-a:text-violet-400 prose-strong:text-white">
        <ReactMarkdown>{legal.content}</ReactMarkdown>
      </div>
    </div>
  );
}
