'use client';

import { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { FiBriefcase, FiUsers, FiDollarSign, FiMail } from 'react-icons/fi';
import Link from 'next/link';

interface Stat { label: string; count: number; icon: React.ElementType; href: string; color: string }

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Projects', count: 0, icon: FiBriefcase, href: '/admin/dashboard/projects', color: 'violet' },
    { label: 'Team Members', count: 0, icon: FiUsers, href: '/admin/dashboard/team', color: 'blue' },
    { label: 'Pricing Plans', count: 0, icon: FiDollarSign, href: '/admin/dashboard/pricing', color: 'emerald' },
    { label: 'Submissions', count: 0, icon: FiMail, href: '/admin/dashboard/submissions', color: 'orange' },
  ]);

  useEffect(() => {
    const cols = ['projects', 'team', 'pricing', 'submissions'];
    Promise.all(cols.map((c) => getCountFromServer(collection(db, c)))).then((results) => {
      setStats((prev) =>
        prev.map((s, i) => ({ ...s, count: results[i].data().count }))
      );
    });
  }, []);

  const colorMap: Record<string, string> = {
    violet: 'bg-violet-500/15 text-violet-400',
    blue: 'bg-blue-500/15 text-blue-400',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    orange: 'bg-orange-500/15 text-orange-400',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, count, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="glass rounded-xl p-5 flex items-center gap-4 hover:border-white/20 transition-colors group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-sm text-white/40">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="font-semibold text-white mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Add new project', href: '/admin/dashboard/projects' },
            { label: 'View submissions', href: '/admin/dashboard/submissions' },
            { label: 'Update pricing', href: '/admin/dashboard/pricing' },
            { label: 'Edit site content', href: '/admin/dashboard/site-content' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/70 hover:text-white transition-all"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
