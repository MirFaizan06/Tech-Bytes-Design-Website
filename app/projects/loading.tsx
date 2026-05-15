import { PageSkeleton } from '@/components/ui/PageSkeleton';

export default function ProjectsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12 animate-pulse">
        <div className="h-4 w-20 bg-surface rounded mx-auto mb-4" />
        <div className="h-10 w-64 bg-surface rounded-xl mx-auto mb-4" />
        <div className="h-5 w-80 bg-surface rounded mx-auto" />
      </div>
      <PageSkeleton />
    </div>
  );
}
