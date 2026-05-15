import { CardSkeleton } from '@/components/ui/PageSkeleton';

export default function RequestDevLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-16 animate-pulse space-y-4">
        <div className="h-12 w-80 bg-surface rounded-xl mx-auto" />
        <div className="h-6 w-96 bg-surface rounded mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
