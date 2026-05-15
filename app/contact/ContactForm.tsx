'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useToast } from '@/hooks/useToast';
import { FiSend } from 'react-icons/fi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function ContactForm() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function update(f: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [f]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let ip = 'unknown';
      try { const res = await fetch('https://api.ipify.org?format=json'); ip = (await res.json()).ip; } catch {}
      await addDoc(collection(db, 'submissions'), { type: 'contact', ...form, ip, userAgent: navigator.userAgent, createdAt: serverTimestamp() });
      showToast("Message sent! We'll reply within 24 hours.", 'success');
      setForm({ name: '', email: '', message: '' });
    } catch { showToast('Failed to send. Please try again.', 'error'); }
    finally { setLoading(false); }
  }

  const inputClass = 'w-full bg-surface border border-theme rounded-xl px-4 py-3 text-primary placeholder:text-muted text-sm focus:outline-none focus:border-violet-500/50 transition-all';

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Name *</label>
          <input value={form.name} onChange={update('name')} required placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Email *</label>
          <input type="email" value={form.email} onChange={update('email')} required placeholder="you@example.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">Message *</label>
        <textarea value={form.message} onChange={update('message')} required rows={6} placeholder="Tell us how we can help..." className={inputClass} />
      </div>
      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all disabled:opacity-50">
        {loading ? <LoadingSpinner size="sm" /> : <><FiSend className="w-4 h-4" /> Send Message</>}
      </button>
    </form>
  );
}
