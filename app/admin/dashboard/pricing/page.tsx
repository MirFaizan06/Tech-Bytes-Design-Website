'use client';

import { useState } from 'react';
import { addDoc, updateDoc, deleteDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { useToast } from '@/hooks/useToast';
import { PricingPlan } from '@/types';
import { orderBy } from 'firebase/firestore';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type FormData = Omit<PricingPlan, 'id'> & { benefitsInput: string };

const EMPTY: FormData = {
  serviceName: '', description: '', startingPrice: 0, upToPrice: 0, benefits: [], order: 0, benefitsInput: '',
};

export default function AdminPricingPage() {
  const { data: plans, loading } = useFirestoreCollection<PricingPlan>('pricing', [orderBy('order', 'asc')]);
  const { showToast } = useToast();
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);

  function openAdd() { setForm(EMPTY); setEditing(null); setModal('add'); }
  function openEdit(p: PricingPlan) {
    setEditing(p);
    setForm({ ...p, benefitsInput: (p.benefits ?? []).join('\n') });
    setModal('edit');
  }
  function closeModal() { setModal(null); setEditing(null); }

  async function handleSave() {
    if (!form.serviceName) { showToast('Service name required.', 'error'); return; }
    setSaving(true);
    try {
      const { benefitsInput, ...rest } = form;
      const data = { ...rest, benefits: benefitsInput.split('\n').map((b) => b.trim()).filter(Boolean) };
      if (modal === 'add') {
        await addDoc(collection(db, 'pricing'), { ...data, createdAt: serverTimestamp() });
        showToast('Plan added!', 'success');
      } else {
        await updateDoc(doc(db, 'pricing', editing!.id), data as any);
        showToast('Plan updated!', 'success');
      }
      closeModal();
    } catch { showToast('Save failed.', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(p: PricingPlan) {
    if (!confirm(`Delete "${p.serviceName}"?`)) return;
    await deleteDoc(doc(db, 'pricing', p.id));
    showToast('Plan deleted.', 'info');
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition-all';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Pricing Plans</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
          <FiPlus /> Add Plan
        </button>
      </div>

      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        : plans.length === 0 ? <EmptyState title="No pricing plans yet" description="Add service packages to display on the pricing page." />
        : (
          <div className="space-y-3">
            {plans.map((p) => (
              <div key={p.id} className="glass rounded-xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{p.serviceName}</h3>
                  <p className="text-sm text-white/40 mt-0.5">{p.description}</p>
                  <div className="mt-2 text-sm text-violet-300 font-medium">
                    ₹{p.startingPrice.toLocaleString('en-IN')} – ₹{p.upToPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.benefits?.slice(0, 4).map((b) => (
                      <span key={b} className="text-xs text-white/40 flex items-center gap-1"><FiCheck className="text-violet-400 w-3 h-3" />{b}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(p)} className="p-1.5 text-white/40 hover:text-violet-400"><FiEdit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p)} className="p-1.5 text-white/40 hover:text-red-400"><FiTrash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0d0d1f] border border-white/10 rounded-2xl p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{modal === 'add' ? 'Add Plan' : 'Edit Plan'}</h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white"><FiX /></button>
            </div>
            <div><label className="label">Service Name *</label><input value={form.serviceName} onChange={(e) => setForm((f) => ({ ...f, serviceName: e.target.value }))} className={inputClass} placeholder="e.g. Landing Page" /></div>
            <div><label className="label">Description</label><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className={inputClass} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Starting Price (₹)</label><input type="number" value={form.startingPrice} onChange={(e) => setForm((f) => ({ ...f, startingPrice: +e.target.value }))} className={inputClass} /></div>
              <div><label className="label">Up To Price (₹)</label><input type="number" value={form.upToPrice} onChange={(e) => setForm((f) => ({ ...f, upToPrice: +e.target.value }))} className={inputClass} /></div>
            </div>
            <div><label className="label">Benefits (one per line)</label><textarea value={form.benefitsInput} onChange={(e) => setForm((f) => ({ ...f, benefitsInput: e.target.value }))} rows={5} className={inputClass} placeholder="Mobile responsive&#10;Custom domain setup&#10;2 rounds of revisions" /></div>
            <div><label className="label">Display Order</label><input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: +e.target.value }))} className={inputClass} /></div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg glass text-sm text-white/60 hover:text-white">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50">
                {saving ? <LoadingSpinner size="sm" /> : 'Save Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`.label{display:block;font-size:.7rem;color:rgba(255,255,255,.4);margin-bottom:.375rem;font-weight:500}`}</style>
    </div>
  );
}
