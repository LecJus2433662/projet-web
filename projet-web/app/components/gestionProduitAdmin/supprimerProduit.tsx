'use client';
import './SupprimerProduit.scss';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Produit } from '../../interfacesPages';

export default function SupprimerProduit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [erreur, setErreur] = useState<string>('');

  useEffect(() => {
    fetch(`http://localhost:8080/api/produits/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: Produit) => { setProduit(data); setLoading(false); })
      .catch(() => router.push('/erreur?raison=produit-introuvable'));
  }, [id, router]);

  const handleSupprimer = async () => {
    if (!produit) return;
    setDeleting(true);
    setErreur('');

    try {
      const res = await fetch(`http://localhost:8080/api/produits/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error();
      router.push('/admin');
    } catch {
      setErreur('Une erreur est survenue lors de la suppression. Réessaie.');
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: 'hsla(333,100%,53%,1)' }} />
    </div>
  );

  if (!produit) return <></>;

  return (
    <div className="supprimer-wrapper">
      <div className="supprimer-card">
        <div className="supprimer-icon">🗑️</div>
        <h1>Supprimer le produit</h1>
        <p className="supprimer-desc">
          Tu es sur le point de supprimer définitivement ce produit.
        </p>

        {/* Aperçu du produit */}
        <div className="produit-preview">
          <img src={produit.image || '/placeholder.jpg'} alt={produit.nom} />
          <div className="preview-info">
            <div className="preview-nom">{produit.nom}</div>
            <div className="preview-prix">{produit.prix.toFixed(2)} $</div>
          </div>
        </div>

        <div className="warning-box">
          ⚠️ <strong>Cette action est irréversible.</strong> Le produit sera retiré de la boutique et de la base de données.
        </div>

        {erreur && (
          <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid var(--danger)', borderRadius: 8, padding: '.75rem', color: 'var(--danger)', fontSize: '.875rem', marginBottom: '1rem' }}>
            {erreur}
          </div>
        )}

        <div className="supprimer-actions">
          <Link href="/admin" className="btn-outline-gradient text-decoration-none">
            ← Annuler
          </Link>
          <button
            className="btn-danger-custom"
            onClick={handleSupprimer}
            disabled={deleting}
          >
            {deleting ? '⏳ Suppression...' : '🗑️ Confirmer la suppression'}
          </button>
        </div>
      </div>
    </div>
  );
}