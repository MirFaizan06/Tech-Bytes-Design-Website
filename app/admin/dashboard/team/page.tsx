'use client';

import { useState, useRef } from 'react';
import { addDoc, updateDoc, deleteDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebaseClient';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { useToast } from '@/hooks/useToast';
import { TeamMember } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Image from 'next/image';

type FormData = Omit<TeamMember, 'id'>;

const EMPTY: FormData = {
  name: '', role: '', photo: '', bio: '',
  socialLinks: { linkedin: '', twitter: '', github: '' },
};

export default function AdminTeamPage() {
  const { data: team, loading } = useFirestoreCollection<TeamMember>('team');
  const { showToast } = useToast();
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function openAdd() { setForm(EMPTY); setEditing(null); setModal('add'); }
  function openEdit(m: TeamMember) { setEditing(m); setForm({ name: m.name, role: m.role, photo: m.photo, bio: m.bio, socialLinks: m.socialLinks ?? {} }); setModal('edit'); }
  function closeModal() { setModal(null); setEditing(null); }

  async function uploadPhoto(file: File) {
    setUploading(true);
    try {
      const r = ref(storage, `team/${Date.now()}_${file.name}`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      setForm((f) => ({ ...f, photo: url }));
      showToast('Photo uploaded!', 'success');
    } catch { showToast('Upload failed.', 'error'); }
    finally { setUploading(false); }
  }

  async function handleSave() {
    if (!form.name || !form.role) { showToast('Name and role are required.', 'error'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        await addDoc(collection(db, 'team'), { ...form, createdAt: serverTimestamp() });
        showToast('Member added!', 'success');
      } else {
        await updateDoc(doc(db, 'team', editing!.id), form as any);
        showToast('Member updated!', 'success');
      }
      closeModal();
    } catch { showToast('Save failed.', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(m: TeamMember) {
    if (!confirm(`Remove ${m.name}?`)) return;
    await deleteDoc(doc(db, 'team', m.id));
    showToast('Member removed.', 'info');
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition-all';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Team</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
          <FiPlus /> Add Member
        </button>
      </div>

      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        : team.length === 0 ? <EmptyState title="No team members yet" description="Add team members to display on the About page." />
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((m) => (
              <div key={m.id} className="glass rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-full bg-white/5 overflow-hidden shrink-0">
                    {m.photo ? <Image src={m.photo} alt={m.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-white/30">{m.name[0]}</div>}
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">{m.name}</h3>
                    <p className="text-xs text-violet-400">{m.role}</p>
                  </div>
                </div>
                <p className="text-xs text-white/40 line-clamp-2 mb-3">{m.bio}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(m)} className="p-1.5 text-white/40 hover:text-violet-400 transition-colors"><FiEdit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(m)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0d0d1f] border border-white/10 rounded-2xl p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{modal === 'add' ? 'Add Member' : 'Edit Member'}</h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white"><FiX /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Name *</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} placeholder="Full name" /></div>
              <div><label className="label">Role *</label><input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className={inputClass} placeholder="Lead Developer" /></div>
            </div>
            <div><label className="label">Bio</label><textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3} className={inputClass} placeholder="Short bio..." /></div>

            <div>
              <label className="label">Photo</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
              <div className="flex items-center gap-3">
                {form.photo && <div className="relative w-12 h-12 rounded-full overflow-hidden"><Image src={form.photo} alt="" fill className="object-cover" /></div>}
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60 transition-all">
                  {uploading ? <LoadingSpinner size="sm" /> : <FiUpload className="w-4 h-4" />} {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            </div>

            <div><label className="label">LinkedIn URL</label><input value={form.socialLinks?.linkedin ?? ''} onChange={(e) => setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, linkedin: e.target.value } }))} className={inputClass} placeholder="https://linkedin.com/in/..." /></div>
            <div><label className="label">GitHub URL</label><input value={form.socialLinks?.github ?? ''} onChange={(e) => setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, github: e.target.value } }))} className={inputClass} placeholder="https://github.com/..." /></div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg glass text-sm text-white/60 hover:text-white">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50">
                {saving ? <LoadingSpinner size="sm" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`.label{display:block;font-size:.7rem;color:rgba(255,255,255,.4);margin-bottom:.375rem;font-weight:500}`}</style>
    </div>
  );
}
