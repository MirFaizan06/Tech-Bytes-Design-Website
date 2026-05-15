import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/30">
        {icon ?? <FiInbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-white/70 mb-1">{title}</h3>
      {description && <p className="text-sm text-white/40 max-w-xs">{description}</p>}
    </div>
  );
}
