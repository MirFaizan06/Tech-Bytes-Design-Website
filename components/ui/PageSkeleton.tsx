export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-8 py-12">
      <div className="h-12 bg-surface rounded-xl w-2/3 mx-auto" />
      <div className="h-6 bg-surface rounded-lg w-1/2 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-surface rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse glass rounded-2xl p-6 space-y-4">
      <div className="h-40 bg-surface-hover rounded-xl" />
      <div className="h-5 bg-surface-hover rounded w-3/4" />
      <div className="h-4 bg-surface-hover rounded w-full" />
      <div className="h-4 bg-surface-hover rounded w-2/3" />
    </div>
  );
}
