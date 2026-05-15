'use client';

import { useState, useRef } from 'react';
import {
  addDoc, updateDoc, deleteDoc, collection, doc, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebaseClient';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { useToast } from '@/hooks/useToast';
import { Project } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiExternalLink } from 'react-icons/fi';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Image from 'next/image';

type FormData = Omit<Project, 'id' | 'createdAt' | 'completionDate'> & {
  completionDate: string;
};

const EMPTY_FORM: FormData = {
  slug: '', title: '', description: '', longDescription: '', tags: [], liveUrl: '',
  githubUrl: '', images: [], completionDate: '', featured: false,
};

export default function AdminProjectsPage() {
  const { data: projects, loading } = useFirestoreCollection<Project>('projects');
  const { showToast } = useToast();
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function openAdd() {
    setForm(EMPTY_FORM);
    setTagsInput('');
    setEditing(null);
    setModal('add');
  }

  function openEdit(p: Project) {
    setEditing(p);
    const cd = (p.completionDate as any)?.toDate?.() ?? new Date(p.completionDate as any);
    setForm({
      slug: p.slug, title: p.title, description: p.description,
      longDescription: p.longDescription ?? '', tags: p.tags ?? [],
      liveUrl: p.liveUrl ?? '', githubUrl: p.githubUrl ?? '',
      images: p.images ?? [], featured: p.featured,
      completionDate: cd instanceof Date ? cd.toISOString().split('T')[0] : '',
    });
    setTagsInput((p.tags ?? []).join(', '));
    setModal('edit');
  }

  function closeModal() { setModal(null); setEditing(null); }

  function updateField(field: keyof FormData, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function uploadImages(files: FileList) {
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const r = ref(storage, `projects/${Date.now()}_${file.name}`);
        await uploadBytes(r, file);
        urls.push(await getDownloadURL(r));
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      showToast(`${urls.length} image(s) uploaded.`, 'success');
    } catch {
      showToast('Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    if (!form.title || !form.slug || !form.description) {
      showToast('Title, slug and description are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const data = {
        ...form,
        tags,
        completionDate: form.completionDate ? new Date(form.completionDate) : new Date(),
      };

      if (modal === 'add') {
        await addDoc(collection(db, 'projects'), { ...data, createdAt: serverTimestamp() });
        showToast('Project added!', 'success');
      } else {
        await updateDoc(doc(db, 'projects', editing!.id), data);
        showToast('Project updated!', 'success');
      }
      closeModal();
    } catch {
      showToast('Save failed. Try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: Project) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'projects', p.id));
      showToast('Project deleted.', 'info');
    } catch {
      showToast('Delete failed.', 'error');
    }
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition-all';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
          <FiPlus /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Add your first project to showcase your work." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="glass rounded-xl p-5 flex gap-4">
              <div className="relative w-20 h-16 rounded-lg bg-white/5 overflow-hidden shrink-0">
                {p.images?.[0] ? <Image src={p.images[0]} alt={p.title} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20 font-bold">{p.title[0]}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-white truncate">{p.title}</h3>
                  <div className="flex gap-1 shrink-0">
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-white/40 hover:text-white"><FiExternalLink className="w-4 h-4" /></a>}
                    <button onClick={() => openEdit(p)} className="p-1.5 text-white/40 hover:text-violet-400 transition-colors"><FiEdit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-xs text-white/40 line-clamp-1 mt-0.5">{p.description}</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">Featured</span>}
                  {p.tags?.slice(0, 3).map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 pb-10 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0d0d1f] border border-white/10 rounded-2xl p-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">{modal === 'add' ? 'Add Project' : 'Edit Project'}</h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white"><FiX /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label">Title *</label><input value={form.title} onChange={(e) => updateField('title', e.target.value)} className={inputClass} placeholder="Project name" /></div>
              <div><label className="label">Slug *</label><input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} className={inputClass} placeholder="my-project" /></div>
            </div>
            <div><label className="label">Short Description *</label><input value={form.description} onChange={(e) => updateField('description', e.target.value)} className={inputClass} placeholder="One line summary" /></div>
            <div><label className="label">Long Description (Markdown)</label><textarea value={form.longDescription} onChange={(e) => updateField('longDescription', e.target.value)} rows={4} className={inputClass} placeholder="Detailed markdown description..." /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label">Live URL</label><input value={form.liveUrl} onChange={(e) => updateField('liveUrl', e.target.value)} className={inputClass} placeholder="https://..." /></div>
              <div><label className="label">GitHub URL</label><input value={form.githubUrl} onChange={(e) => updateField('githubUrl', e.target.value)} className={inputClass} placeholder="https://github.com/..." /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label">Tags (comma-separated)</label><input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={inputClass} placeholder="React, Next.js, Firebase" /></div>
              <div><label className="label">Completion Date</label><input type="date" value={form.completionDate} onChange={(e) => updateField('completionDate', e.target.value)} className={inputClass} /></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} className="w-4 h-4 accent-violet-600" />
              <label htmlFor="featured" className="text-sm text-white/70">Featured on homepage</label>
            </div>

            {/* Image upload */}
            <div>
              <label className="label">Images (.webp)</label>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && uploadImages(e.target.files)} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60 hover:text-white transition-all">
                {uploading ? <LoadingSpinner size="sm" /> : <FiUpload className="w-4 h-4" />}
                {uploading ? 'Uploading...' : 'Upload Images'}
              </button>
              {form.images.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative w-16 h-12 rounded-lg overflow-hidden group">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-red-400"><FiX /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg glass text-sm text-white/60 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
                {saving ? <LoadingSpinner size="sm" /> : 'Save Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`.label { display: block; font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-bottom: 0.375rem; font-weight: 500; }`}</style>
    </div>
  );
}
