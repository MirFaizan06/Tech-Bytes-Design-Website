'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiGrid, FiBriefcase, FiUsers, FiDollarSign, FiFileText,
  FiMail, FiEdit, FiLogOut, FiMenu, FiX,
} from 'react-icons/fi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/admin/dashboard', icon: FiGrid, label: 'Overview' },
  { href: '/admin/dashboard/projects', icon: FiBriefcase, label: 'Projects' },
  { href: '/admin/dashboard/team', icon: FiUsers, label: 'Team' },
  { href: '/admin/dashboard/pricing', icon: FiDollarSign, label: 'Pricing' },
  { href: '/admin/dashboard/legals', icon: FiFileText, label: 'Legals' },
  { href: '/admin/dashboard/submissions', icon: FiMail, label: 'Submissions' },
  { href: '/admin/dashboard/site-content', icon: FiEdit, label: 'Site Content' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/admin');
  }, [user, loading, router]);

  useEffect(() => setSidebarOpen(false), [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060611]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  async function handleLogout() {
    await signOut(auth);
    router.replace('/admin');
  }

  const Sidebar = () => (
    <aside className="w-64 bg-white/3 border-r border-white/10 flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <Image src="/logo.svg" alt="TBD" width={28} height={28} />
        <span className="font-bold text-white text-sm">Admin Panel</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                active
                  ? 'bg-violet-600/20 text-white border border-violet-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-violet-400' : ''}`} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-2">
          <div className="text-xs text-white/40 truncate">{user.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <FiLogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-[#060611]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 md:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-14 border-b border-white/10 flex items-center px-4 gap-4">
          <button
            className="md:hidden text-white/60 hover:text-white p-1"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
          <span className="text-sm text-white/40">
            {navItems.find((n) => n.href === pathname)?.label ?? 'Dashboard'}
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
