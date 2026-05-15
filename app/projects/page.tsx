import type { Metadata } from 'next';
import { ProjectsGrid } from './ProjectsGrid';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Browse all projects built by Tech Bytes Design — from landing pages to full-stack web applications.',
};

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Portfolio</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
          Our <span className="gradient-text">Work</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto">
          Every project is built from scratch — no templates, no shortcuts.
        </p>
      </div>
      <ProjectsGrid />
    </div>
  );
}
