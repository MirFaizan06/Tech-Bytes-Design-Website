'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useToast } from '@/hooks/useToast';
import { FiSend } from 'react-icons/fi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export function RequestForm() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  function update(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      let ip = 'unknown';
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
      } catch {}

      await addDoc(collection(db, 'submissions'), {
        type: 'request-development',
        ...form,
        ip,
        userAgent: navigator.userAgent,
        createdAt: serverTimestamp(),
      });
      showToast('Your request has been sent! We\'ll be in touch within 24 hours.', 'success');
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch {
      showToast('Failed to send. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all';

  return (
    <form id="request-form" onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Name *</label>
          <input value={form.name} onChange={update('name')} required placeholder="Your full name" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Email *</label>
          <input type="email" value={form.email} onChange={update('email')} required placeholder="you@example.com" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Phone</label>
          <input value={form.phone} onChange={update('phone')} placeholder="+91 ..." className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Service Interested In</label>
          <select value={form.service} onChange={update('service')} className={inputClass}>
            <option value="">Select a service...</option>
            <option value="Landing Page">Landing Page</option>
            <option value="Business Website">Business Website</option>
            <option value="Web Application">Web Application</option>
            <option value="E-Commerce">E-Commerce</option>
            <option value="Custom Project">Custom Project</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Project Details *</label>
        <textarea
          value={form.message}
          onChange={update('message')}
          required
          rows={5}
          placeholder="Describe your project, goals, and any specific requirements..."
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <LoadingSpinner size="sm" /> : <><FiSend className="w-4 h-4" /> Send Request</>}
      </button>
    </form>
  );
}
