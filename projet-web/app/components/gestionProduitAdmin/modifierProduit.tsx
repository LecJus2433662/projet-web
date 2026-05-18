'use client';
import './ajouter_modifierProduit.scss';
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
  const [succes, setSucces] = useState('');

  useEffect(() => {
    fetch(`/api/produits/${id}`)
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
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setErreur('');
    setSucces('');

    try {
      const res = await fetch(`/api/produits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Envoie le token si ton backend le demande
          'Authorization': `Bearer ${document.cookie.match(/token=([^;]+)/)?.[1] ?? ''}`,
        },
        body: JSON.stringify({
          nom:              form.nom,
          description:      form.description,
          prix:             parseFloat(String(form.prix)),
          nbProduitRestant: parseInt(String(form.nbProduitRestant)), // ← nom exact de ton backend
          image:            form.image,
        }),
      });
      
      if (!res.ok) throw new Error();

      setSucces('✅ Produit modifié avec succès !');
      setSaving(false);

      // Retour au dashboard après 1.5s
      setTimeout(() => router.push('/admin'), 1500);

    } catch {
      setErreur('Erreur lors de la sauvegarde. Vérifie ta connexion au backend.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form || !confirm(`Supprimer « ${form.nom} » ? Cette action est irréversible.`)) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/produits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${document.cookie.match(/token=([^;]+)/)?.[1] ?? ''}`,
        },
      });
      if (!res.ok) throw new Error();
      router.push('/admin');
    } catch {
      setErreur('Erreur lors de la suppression.');
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: 'var(--orange)' }} />
    </div>
  );

  if (!form) return <></>;

  return (
    <div className="section-main produit-form-wrapper">
      <Link href="/admin" style={{ color: 'var(--orange)', textDecoration: 'none', fontSize: '.9rem' }}>
        ← Retour
      </Link>
      <h1>✏️ Modifier le produit</h1>

      <form onSubmit={handleSave} className="form-card d-flex flex-column gap-3">
        <div>
          <label className="form-label">Nom *</label>
          <input name="nom" className="form-control" value={form.nom} onChange={handleChange} required />
        </div>

        <div>
          <label className="form-label">Description *</label>
          <textarea name="description" className="form-control" rows={4} value={form.description} onChange={handleChange} required />
        </div>

        <div className="row g-3">
          <div className="col-6">
            <label className="form-label">Prix ($) *</label>
            <input name="prix" type="number" step="0.01" min="0" className="form-control" value={form.prix} onChange={handleChange} required />
          </div>
          <div className="col-6">
            <label className="form-label">Quantité en stock *</label>
            <input name="nbProduitRestant" type="number" min="0" className="form-control" value={form.nbProduitRestant} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <label className="form-label">URL image</label>
          <input name="image" type="url" className="form-control" value={form.image || ''} onChange={handleChange} />
        </div>
        {/* Messages */}
        {erreur && (
          <div className="error-box">{erreur}</div>
        )}
        {succes && (
          <div style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 4, padding: '.75rem 1rem', color: '#6ee7b7', fontSize: '.875rem' }}>
            {succes}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-gradient" disabled={saving}>
            {saving ? '⏳ Sauvegarde...' : '💾 Appliquer les modifications'}
          </button>
          <button type="button" className="btn-danger-custom" onClick={handleDelete} disabled={deleting}>
            {deleting ? '⏳ Suppression...' : '🗑️ Supprimer le produit'}
          </button>
        </div>
      </form>
    </div>
  );
}