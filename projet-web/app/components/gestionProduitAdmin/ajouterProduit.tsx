'use client';
import './ajouter_modifierProduit.scss';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { FormProduit } from '../../interfacesPages';

export default function AjouterProduit() {
  const router = useRouter();
  const [form, setForm] = useState<FormProduit>({ nom: '', description: '', prix: '', quantite: '', image: '', disponible: true });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setErreur('');
    try {
      const res = await fetch('http://localhost:8080/api/produits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, prix: parseFloat(form.prix), quantite: parseInt(form.quantite) }),
      });
      if (!res.ok) throw new Error();
      router.push('/admin');
    } catch { setErreur("Erreur lors de l'ajout."); setLoading(false); }
  };

  return (
    <div className="section-main produit-form-wrapper">
      <Link href="/admin" style={{ color: 'hsla(333,100%,53%,1)', textDecoration: 'none', fontSize: '.9rem' }}>← Retour</Link>
      <h1>➕ Ajouter un produit</h1>
      <form onSubmit={handleSubmit} className="form-card d-flex flex-column gap-3">
        <div><label className="form-label">Nom *</label><input name="nom" className="form-control" value={form.nom} onChange={handleChange} required /></div>
        <div><label className="form-label">Description *</label><textarea name="description" className="form-control" rows={4} value={form.description} onChange={handleChange} required /></div>
        <div className="row g-3">
          <div className="col-6"><label className="form-label">Prix ($) *</label><input name="prix" type="number" step="0.01" min="0" className="form-control" value={form.prix} onChange={handleChange} required /></div>
          <div className="col-6"><label className="form-label">Quantité *</label><input name="quantite" type="number" min="0" className="form-control" value={form.quantite} onChange={handleChange} required /></div>
        </div>
        <div><label className="form-label">URL image</label><input name="image" type="url" className="form-control" placeholder="https://..." value={form.image} onChange={handleChange} /></div>
        <div className="d-flex align-items-center gap-2">
          <input name="disponible" type="checkbox" id="disponible" checked={form.disponible} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'hsla(333,100%,53%,1)', cursor: 'pointer' }} />
          <label htmlFor="disponible" style={{ cursor: 'pointer', marginBottom: 0 }}>Disponible à la vente</label>
        </div>
        {erreur && <div className="error-box">{erreur}</div>}
        <button type="submit" className="btn-gradient" disabled={loading}>{loading ? '⏳ Ajout...' : '✅ Ajouter'}</button>
      </form>
    </div>
  );
}