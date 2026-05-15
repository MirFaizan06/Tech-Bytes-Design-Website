'use client';

import { motion } from 'framer-motion';
import { useMounted } from '@/hooks/useMounted';

const codeLines = [
  { indent: 0, tokens: [{ t: 'const ', c: 'keyword' }, { t: 'website', c: 'var' }, { t: ' = ', c: 'op' }, { t: 'build', c: 'fn' }, { t: '({', c: 'punct' }] },
  { indent: 1, tokens: [{ t: 'stack', c: 'prop' }, { t: ': ', c: 'op' }, { t: "'Next.js + Firebase'", c: 'str' }, { t: ',', c: 'punct' }] },
  { indent: 1, tokens: [{ t: 'design', c: 'prop' }, { t: ': ', c: 'op' }, { t: "'pixel-perfect'", c: 'str' }, { t: ',', c: 'punct' }] },
  { indent: 1, tokens: [{ t: 'delivery', c: 'prop' }, { t: ': ', c: 'op' }, { t: "'~3 weeks'", c: 'str' }, { t: ',', c: 'punct' }] },
  { indent: 0, tokens: [{ t: '});', c: 'punct' }] },
];

const colorMap: Record<string, string> = {
  keyword: 'text-violet-500 dark:text-violet-400',
  var:     'text-sky-600 dark:text-sky-400',
  fn:      'text-amber-600 dark:text-amber-400',
  prop:    'text-rose-500 dark:text-rose-400',
  str:     'text-emerald-600 dark:text-emerald-400',
  op:      'text-secondary',
  punct:   'text-muted',
};

export function HeroVisual() {
  const mounted = useMounted();

  // Render a stable invisible placeholder on the server so React hydration
  // sees identical HTML — Framer Motion's initial styles differ SSR vs client.
  if (!mounted) {
    return <div className="hidden lg:block relative opacity-0 pointer-events-none" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
      className="hidden lg:block relative"
    >
      {/* Floating glow behind card */}
      <div className="absolute -inset-8 bg-violet-400/10 dark:bg-violet-600/10 rounded-3xl blur-3xl" />

      {/* Code card */}
      <div className="relative glass rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-theme bg-surface-hover">
          <span className="w-3 h-3 rounded-full bg-red-400/70" />
          <span className="w-3 h-3 rounded-full bg-amber-400/70" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-xs text-muted font-mono">project.ts</span>
        </div>

        {/* Code body */}
        <div className="px-5 py-5 font-mono text-sm space-y-1.5 bg-surface">
          {codeLines.map((line, li) => (
            <motion.div
              key={li}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + li * 0.12, duration: 0.3 }}
              className="flex"
            >
              <span className="text-muted select-none w-5 text-right mr-4 text-xs leading-5">
                {li + 1}
              </span>
              <span style={{ paddingLeft: `${line.indent * 16}px` }}>
                {line.tokens.map((tok, ti) => (
                  <span key={ti} className={colorMap[tok.c]}>{tok.t}</span>
                ))}
              </span>
            </motion.div>
          ))}

          {/* Blinking cursor */}
          <div className="flex">
            <span className="text-muted select-none w-5 text-right mr-4 text-xs leading-5">6</span>
            <motion.span
              className="inline-block w-2 h-4 bg-violet-500 rounded-sm"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-theme bg-surface-hover">
          <span className="text-xs text-muted font-mono">TypeScript</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">Build passing</span>
          </div>
        </div>
      </div>

      {/* Floating badge — delivery time */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.4, type: 'spring' }}
        className="absolute -bottom-5 -left-8 glass rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg"
      >
        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 text-sm font-bold">⚡</div>
        <div>
          <div className="text-xs text-muted">Avg. delivery</div>
          <div className="text-sm font-bold text-primary">~3 weeks</div>
        </div>
      </motion.div>

      {/* Floating badge — satisfaction */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.4, type: 'spring' }}
        className="absolute -top-5 -right-8 glass rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg"
      >
        <div className="text-lg">✦</div>
        <div>
          <div className="text-xs text-muted">Code quality</div>
          <div className="text-sm font-bold text-primary">Production-grade</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
