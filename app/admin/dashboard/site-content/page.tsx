'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useToast } from '@/hooks/useToast';
import { SiteContent } from '@/types';
import { FiSave } from 'react-icons/fi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const FIELDS: { key: keyof SiteContent; label: string; multiline?: boolean }[] = [
  { key: 'heroTitle', label: 'Hero Title' },
  { key: 'heroSubtitle', label: 'Hero Subtitle', multiline: true },
  { key: 'ctaText', label: 'CTA Button Text' },
  { key: 'aboutIntro', label: 'About Page Intro', multiline: true },
];

export default function AdminSiteContentPage() {
  const { showToast } = useToast();
  const [content, setContent] = useState<SiteContent>({
    heroTitle: '', heroSubtitle: '', ctaText: '', aboutIntro: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'siteContent', 'homepage')).then((snap) => {
      if (snap.exists()) setContent(snap.data() as SiteContent);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await setDoc(doc(db, 'siteContent', 'homepage'), { ...content, updatedAt: serverTimestamp() });
      showToast('Site content saved!', 'success');
    } catch { showToast('Save failed.', 'error'); }
    finally { setSaving(false); }
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition-all';

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Site Content</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {saving ? <LoadingSpinner size="sm" /> : <FiSave className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="glass rounded-2xl p-7 space-y-6 max-w-2xl">
        {FIELDS.map(({ key, label, multiline }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>
            {multiline ? (
              <textarea
                value={content[key] ?? ''}
                onChange={(e) => setContent((c) => ({ ...c, [key]: e.target.value }))}
                rows={3}
                className={inputClass}
                placeholder={`Enter ${label.toLowerCase()}...`}
              />
            ) : (
              <input
                value={content[key] ?? ''}
                onChange={(e) => setContent((c) => ({ ...c, [key]: e.target.value }))}
                className={inputClass}
                placeholder={`Enter ${label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
