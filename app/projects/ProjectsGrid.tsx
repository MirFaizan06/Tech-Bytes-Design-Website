'use client';

import { useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { Project } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/PageSkeleton';
import { FiBriefcase } from 'react-icons/fi';

export function ProjectsGrid() {
  const { data: projects, loading } = useFirestoreCollection<Project>('projects', [
    orderBy('createdAt', 'desc'),
  ]);
  const [activeTag, setActiveTag] = useState<string>('All');

  const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags ?? [])))];
  const filtered = activeTag === 'All' ? projects : projects.filter((p) => p.tags?.includes(activeTag));

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="We're working on something amazing. Check back soon!"
        icon={<FiBriefcase className="w-8 h-8" />}
      />
    );
  }

  return (
    <>
      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTag === tag
                ? 'bg-violet-600 text-white'
                : 'glass text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="group glass rounded-2xl overflow-hidden"
          >
            <Link href={`/projects/${project.slug}`} className="block">
              <div className="relative h-48 bg-gradient-to-br from-violet-900/30 to-blue-900/20 overflow-hidden">
                {project.images?.[0] ? (
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/10">
                    {project.title[0]}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </Link>

            <div className="p-6">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/projects/${project.slug}`}>
                <h3 className="font-semibold text-white hover:text-violet-300 transition-colors mb-2">{project.title}</h3>
              </Link>
              <p className="text-sm text-white/50 line-clamp-2 mb-4">{project.description}</p>
              <div className="flex gap-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                    <FiExternalLink className="w-3.5 h-3.5" /> Live
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                    <FiGithub className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && activeTag !== 'All' && (
        <EmptyState title={`No projects tagged "${activeTag}"`} description="Try another filter." />
      )}
    </>
  );
}
