'use client';

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

interface Option { value: string; label: string; }

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function CustomSelect({ options, value, onChange, placeholder = 'Select...', label }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((v) => !v); }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = options.findIndex((o) => o.value === value);
      const next = options[Math.min(idx + 1, options.length - 1)];
      if (next) onChange(next.value);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = options.findIndex((o) => o.value === value);
      const prev = options[Math.max(idx - 1, 0)];
      if (prev) onChange(prev.value);
    }
  }

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-xs font-medium text-muted mb-1.5">{label}</label>}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-2 bg-surface border rounded-xl px-4 py-3 text-sm text-left transition-all duration-200 focus:outline-none ${
          open ? 'border-violet-500/50' : 'border-theme hover:border-theme-strong'
        } ${selected ? 'text-primary' : 'text-muted'}`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <FiChevronDown
          className={`w-4 h-4 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1.5 bg-surface border border-theme rounded-xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => { onChange(option.value); setOpen(false); }}
                  className={`flex items-center justify-between gap-2 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100 ${
                    isSelected
                      ? 'bg-violet-50 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300'
                      : 'text-secondary hover:bg-surface-hover hover:text-primary'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <FiCheck className="w-4 h-4 text-violet-500 shrink-0" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
