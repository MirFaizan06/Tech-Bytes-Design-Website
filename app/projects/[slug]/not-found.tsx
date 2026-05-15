import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function ProjectNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl font-black text-white/10 mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">Project not found</h1>
      <p className="text-white/50 mb-6">This project doesn't exist or has been removed.</p>
      <Link href="/projects" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to all projects
      </Link>
    </div>
  );
}
