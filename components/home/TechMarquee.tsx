'use client';

import { motion } from 'framer-motion';
import { useMounted } from '@/hooks/useMounted';

const techs = [
  { name: 'Next.js',    symbol: '▲' },
  { name: 'React',      symbol: '⚛' },
  { name: 'TypeScript', symbol: 'TS' },
  { name: 'Tailwind',   symbol: '~' },
  { name: 'Firebase',   symbol: '🔥' },
  { name: 'Framer',     symbol: 'F' },
  { name: 'GSAP',       symbol: '⚡' },
  { name: 'Vercel',     symbol: '▲' },
  { name: 'Figma',      symbol: '◈' },
  { name: 'Node.js',    symbol: '⬡' },
];

function Track({ reverse = false }: { reverse?: boolean }) {
  const items = [...techs, ...techs];
  return (
    <motion.div
      className="flex gap-4 w-max"
      animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
      transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
    >
      {items.map((t, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass shrink-0 group"
        >
          <span className="text-sm font-mono text-violet-500 dark:text-violet-400 w-5 text-center leading-none">
            {t.symbol}
          </span>
          <span className="text-sm font-medium text-secondary whitespace-nowrap">{t.name}</span>
        </div>
      ))}
    </motion.div>
  );
}

export function TechMarquee() {
  const mounted = useMounted();

  return (
    <div className="relative overflow-hidden py-2 space-y-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-[var(--bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-[var(--bg)] to-transparent" />

      {/* Only animate after mount — motion.div with animated x differs SSR vs client */}
      {mounted ? (
        <>
          <Track />
          <Track reverse />
        </>
      ) : (
        <div className="flex gap-4 overflow-hidden opacity-0 h-10" />
      )}
    </div>
  );
}
