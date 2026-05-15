import { CardSkeleton } from '@/components/ui/PageSkeleton';

export default function ContactLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-16 animate-pulse space-y-4">
        <div className="h-12 w-64 bg-surface rounded-xl mx-auto" />
        <div className="h-6 w-72 bg-surface rounded mx-auto" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="lg:col-span-3"><CardSkeleton /></div>
      </div>
    </div>
  );
}
