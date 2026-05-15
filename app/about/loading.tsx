import { PageSkeleton } from '@/components/ui/PageSkeleton';

export default function AboutLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-16 animate-pulse space-y-4">
        <div className="h-12 w-96 bg-surface rounded-xl mx-auto" />
        <div className="h-6 w-80 bg-surface rounded mx-auto" />
      </div>
      <PageSkeleton />
    </div>
  );
}
