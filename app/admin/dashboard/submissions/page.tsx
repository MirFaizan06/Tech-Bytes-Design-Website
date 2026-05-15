'use client';

import { useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { Submission } from '@/types';
import { FiMail, FiFilter } from 'react-icons/fi';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminSubmissionsPage() {
  const { data: submissions, loading } = useFirestoreCollection<Submission>('submissions', [
    orderBy('createdAt', 'desc'),
  ]);
  const [filter, setFilter] = useState<'all' | 'contact' | 'request-development'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'all' ? submissions : submissions.filter((s) => s.type === filter);

  function formatDate(ts: any) {
    const d = ts?.toDate?.() ?? new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Submissions</h1>
        <div className="flex items-center gap-2">
          <FiFilter className="text-white/40 w-4 h-4" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-violet-500/50"
          >
            <option value="all">All Types</option>
            <option value="contact">Contact</option>
            <option value="request-development">Project Requests</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No submissions yet" description="Contact form submissions and project requests will appear here." icon={<FiMail className="w-8 h-8" />} />
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.type === 'contact' ? 'bg-blue-500/15 text-blue-400' : 'bg-violet-500/15 text-violet-400'
                    }`}>
                      {s.type === 'contact' ? 'Contact' : 'Project Request'}
                    </span>
                    <span className="text-xs text-white/30">{formatDate(s.createdAt)}</span>
                    {s.ip && <span className="text-xs text-white/20">IP: {s.ip}</span>}
                  </div>
                  <h3 className="font-medium text-white mt-1.5">{s.name}</h3>
                  <p className="text-sm text-white/50">{s.email}</p>
                  {s.service && <p className="text-xs text-violet-400 mt-0.5">Service: {s.service}</p>}
                  <p className="text-sm text-white/40 mt-2 line-clamp-2">{s.message}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href={`mailto:${s.email}?subject=Re: Your inquiry at Tech Bytes Design`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 text-xs transition-colors"
                  >
                    <FiMail className="w-3.5 h-3.5" /> Reply
                  </a>
                  <button
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="px-3 py-1.5 rounded-lg glass text-xs text-white/50 hover:text-white transition-colors"
                  >
                    {expanded === s.id ? 'Less' : 'More'}
                  </button>
                </div>
              </div>

              {expanded === s.id && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <div className="text-xs text-white/30 font-medium">Full message:</div>
                  <p className="text-sm text-white/60 whitespace-pre-wrap">{s.message}</p>
                  {s.phone && <p className="text-xs text-white/40">Phone: {s.phone}</p>}
                  {s.userAgent && <p className="text-xs text-white/20 truncate">UA: {s.userAgent}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
