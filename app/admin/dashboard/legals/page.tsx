'use client';

import { useState, useRef } from 'react';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebaseClient';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { useToast } from '@/hooks/useToast';
import { Legal } from '@/types';
import { FiEdit2, FiUpload, FiExternalLink } from 'react-icons/fi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const LEGAL_TYPES = [
  { key: 'terms', label: 'Terms of Service' },
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'refund', label: 'Refund Policy' },
];

export default function AdminLegalsPage() {
  const { data: legals, loading } = useFirestoreCollection<Legal>('legals');
  const { showToast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<string>('');

  function openEdit(type: string) {
    const legal = legals.find((l) => l.type === type);
    setContent(legal?.content ?? '');
    setEditing(type);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'legals', editing), { type: editing, content, updatedAt: serverTimestamp() }, { merge: true });
      showToast('Legal doc saved!', 'success');
      setEditing(null);
    } catch { showToast('Save failed.', 'error'); }
    finally { setSaving(false); }
  }

  async function handlePDFUpload(file: File, type: string) {
    setUploading(type);
    try {
      const r = ref(storage, `legals/${type}.pdf`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await setDoc(doc(db, 'legals', type), { pdfUrl: url }, { merge: true });
      showToast('PDF uploaded!', 'success');
    } catch { showToast('Upload failed.', 'error'); }
    finally { setUploading(null); }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Legal Documents</h1>
      <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => {
        if (e.target.files?.[0]) handlePDFUpload(e.target.files[0], uploadTarget.current);
      }} />

      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : (
        <div className="space-y-4">
          {LEGAL_TYPES.map(({ key, label }) => {
            const legal = legals.find((l) => l.type === key);
            return (
              <div key={key} className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{label}</h3>
                    <p className="text-xs text-white/40 mt-0.5">
                      {legal?.content ? `${legal.content.length} characters` : 'No content yet'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {legal?.pdfUrl && (
                      <a href={legal.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-white/60 hover:text-white transition-colors">
                        <FiExternalLink className="w-3.5 h-3.5" /> PDF
                      </a>
                    )}
                    <button
                      onClick={() => { uploadTarget.current = key; fileRef.current?.click(); }}
                      disabled={uploading === key}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-white/60 hover:text-white transition-colors"
                    >
                      {uploading === key ? <LoadingSpinner size="sm" /> : <FiUpload className="w-3.5 h-3.5" />}
                      {uploading === key ? 'Uploading...' : 'Upload PDF'}
                    </button>
                    <button onClick={() => openEdit(key)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 text-violet-300 text-xs hover:bg-violet-600/30 transition-colors">
                      <FiEdit2 className="w-3.5 h-3.5" /> Edit Content
                    </button>
                  </div>
                </div>
                {legal?.content && (
                  <p className="text-xs text-white/30 line-clamp-2 font-mono">{legal.content.substring(0, 200)}...</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 pb-10 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0d0d1f] border border-white/10 rounded-2xl p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Edit: {LEGAL_TYPES.find((t) => t.key === editing)?.label}
              </h2>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-white/40">Supports Markdown formatting.</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-violet-500/50 resize-y"
              placeholder="# Terms of Service&#10;&#10;Write your content in Markdown..."
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg glass text-sm text-white/60 hover:text-white">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50">
                {saving ? <LoadingSpinner size="sm" /> : 'Save Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
