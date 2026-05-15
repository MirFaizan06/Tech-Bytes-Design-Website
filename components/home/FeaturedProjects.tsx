'use client';

import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useEffect, useState } from 'react';
import { Project } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiExternalLink, FiArrowRight } from 'react-icons/fi';
import { CardSkeleton } from '@/components/ui/PageSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(
          collection(db, 'projects'),
          where('featured', '==', true),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const snap = await getDocs(q);
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (projects.length === 0) {
    return <EmptyState title="No featured projects yet" description="Check back soon!" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{ y: -4 }}
          className="group glass rounded-2xl overflow-hidden"
        >
          <div className="relative h-48 bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 overflow-hidden">
            {project.images?.[0] ? (
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-violet-300 dark:text-white/10">
                {project.title[0]}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags?.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="font-semibold text-primary mb-2 line-clamp-1">{project.title}</h3>
            <p className="text-sm text-muted line-clamp-2 mb-4">{project.description}</p>
            <div className="flex items-center gap-3">
              <Link
                href={`/projects/${project.slug}`}
                className="flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors font-medium"
              >
                View project <FiArrowRight className="w-4 h-4" />
              </Link>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-secondary transition-colors">
                  <FiExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
