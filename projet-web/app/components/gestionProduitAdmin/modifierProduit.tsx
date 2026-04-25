'use client';
import './ModifierProduit.scss';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Produit } from '../../interfacesPages';

export default function ModifierProduit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8080/api/produits/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: Produit) => { setForm(data); setLoading(false); })
      .catch(() => router.push('/erreur?raison=produit-introuvable'));
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((f) => f ? { ...f, [name]: type === 'checkbox' ? checked : value } : f);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!form) return;
    setSaving(true); setErreur('');
    try {
      const res = await fetch(`http://localhost:8080/api/produits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, prix: parseFloat(String(form.prix)), quantite: parseInt(String(form.quantite)) }),
      });
      if (!res.ok) throw new Error();
      router.push('/admin');
    } catch { setErreur('Erreur lors de la sauvegarde.'); setSaving(false); }
  };

  const handleDelete = async () => {
    if (!form || !confirm(`Supprimer « ${form.nom} » ?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:8080/api/produits/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      router.push('/admin');
    } catch { setErreur('Erreur lors de la suppression.'); setDeleting(false); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" style={{ color: 'hsla(333,100%,53%,1)' }} /></div>;
  if (!form) return <></>;

  return (
    <div className="section-main produit-form-wrapper">
      <Link href="/admin" style={{ color: 'hsla(333,100%,53%,1)', textDecoration: 'none', fontSize: '.9rem' }}>← Retour</Link>
      <h1>✏️ Modifier le produit</h1>
      <form onSubmit={handleSave} className="form-card d-flex flex-column gap-3">
        <div><label className="form-label">Nom *</label><input name="nom" className="form-control" value={form.nom} onChange={handleChange} required /></div>
        <div><label className="form-label">Description *</label><textarea name="description" className="form-control" rows={4} value={form.description} onChange={handleChange} required /></div>
        <div className="row g-3">
          <div className="col-6"><label className="form-label">Prix ($) *</label><input name="prix" type="number" step="0.01" min="0" className="form-control" value={form.prix} onChange={handleChange} required /></div>
          <div className="col-6"><label className="form-label">Quantité *</label><input name="quantite" type="number" min="0" className="form-control" value={form.quantite} onChange={handleChange} required /></div>
        </div>
        <div><label className="form-label">URL image</label><input name="image" type="url" className="form-control" value={form.image || ''} onChange={handleChange} /></div>
        <div className="d-flex align-items-center gap-2">
          <input name="disponible" type="checkbox" id="disponible" checked={form.disponible} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'hsla(333,100%,53%,1)', cursor: 'pointer' }} />
          <label htmlFor="disponible" style={{ cursor: 'pointer', marginBottom: 0 }}>Disponible à la vente</label>
        </div>
        {erreur && <div className="error-box">{erreur}</div>}
        <div className="form-actions">
          <button type="submit" className="btn-gradient" disabled={saving}>{saving ? '⏳ Sauvegarde...' : '💾 Appliquer'}</button>
          <button type="button" className="btn-danger-custom" onClick={handleDelete} disabled={deleting}>{deleting ? '⏳...' : '🗑️ Supprimer'}</button>
        </div>
      </form>
    </div>
  );
}