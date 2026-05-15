import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4 text-muted">
        {icon ?? <FiInbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-secondary mb-1">{title}</h3>
      {description && <p className="text-sm text-muted max-w-xs">{description}</p>}
    </div>
  );
}
