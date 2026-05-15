'use client';

import { createContext, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info';

interface Toast { id: string; type: ToastType; message: string; }

interface ToastContextValue { showToast: (message: string, type?: ToastType) => void; }

export const ToastContext = createContext<ToastContextValue | null>(null);

const icons = {
  success: <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
  error:   <FiAlertCircle className="w-5 h-5 text-red-500" />,
  info:    <FiInfo className="w-5 h-5 text-violet-500" />,
};

const colors = {
  success: 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10',
  error:   'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10',
  info:    'border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${colors[t.type]}`}
            >
              <span className="mt-0.5 shrink-0">{icons[t.type]}</span>
              <p className="text-sm text-primary flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-muted hover:text-primary transition-colors shrink-0"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
