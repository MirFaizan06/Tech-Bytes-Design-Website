import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db as adminDb } from '@/lib/firebaseAdmin';
import { FiArrowLeft, FiExternalLink, FiGithub, FiCalendar, FiTag } from 'react-icons/fi';
import { ProjectGallery } from './ProjectGallery';
import ReactMarkdown from 'react-markdown';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  const snap = await adminDb
    .collection('projects')
    .where('slug', '==', slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as any;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.images?.[0] ? [{ url: project.images[0] }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const completionDate = project.completionDate?.toDate?.() ?? new Date(project.completionDate);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags?.map((tag: string) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{project.title}</h1>
        <p className="text-white/60 text-lg">{project.description}</p>

        <div className="flex flex-wrap gap-6 mt-6">
          {completionDate && (
            <div className="flex items-center gap-2 text-sm text-white/40">
              <FiCalendar className="w-4 h-4 text-violet-400" />
              {completionDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </div>
          )}
          <div className="flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
              >
                <FiExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-white text-sm font-medium transition-colors"
              >
                <FiGithub className="w-4 h-4" /> Source Code
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {project.images?.length > 0 && <ProjectGallery images={project.images} title={project.title} />}

      {/* Long description */}
      {project.longDescription && (
        <div className="mt-12 glass rounded-2xl p-8 prose prose-invert max-w-none prose-p:text-white/60 prose-headings:text-white prose-a:text-violet-400">
          <ReactMarkdown>{project.longDescription}</ReactMarkdown>
        </div>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.description,
            url: project.liveUrl,
            image: project.images?.[0],
            dateCreated: completionDate?.toISOString(),
            creator: { '@type': 'Organization', name: 'Tech Bytes Design' },
          }),
        }}
      />
    </div>
  );
}
