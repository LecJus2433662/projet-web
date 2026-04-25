'use client';
import './DetailProduit.scss';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Produit } from '../interfacesPages';

export default function DetailProduit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/produits/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: Produit) => { setProduit(data); setLoading(false); })
      .catch(() => router.push('/erreur?raison=produit-introuvable'));
  }, [id, router]);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: 'hsla(333,100%,53%,1)' }} />
    </div>
  );
  if (!produit) return <></>;

  return (
    <div className="detail-container">
      <div className="breadcrumb-custom">
        <Link href="/">Boutique</Link> › {produit.nom}
      </div>
      <div className="detail-card">
        <img src={produit.image || '/placeholder.jpg'} alt={produit.nom} className="detail-image" />
        <div className="detail-info">
          <h1>{produit.nom}</h1>
          <span className="detail-price">{produit.prix.toFixed(2)} $</span>
          <p className="detail-desc">{produit.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className={`dispo-badge ${produit.disponible ? 'dispo' : 'indispo'}`}>
              {produit.disponible ? '✅ Disponible' : '❌ Indisponible'}
            </span>
            <span className="stock-info">📦 {produit.quantite} en stock</span>
          </div>
          <div className="detail-actions">
            {produit.disponible && produit.quantite > 0 ? (
              <Link href={`/achat/${produit.id}`} className="btn-gradient text-decoration-none">
                💳 Acheter maintenant
              </Link>
            ) : (
              <button className="btn-gradient" disabled>Rupture de stock</button>
            )}
            <Link href="/" className="btn-outline-gradient text-decoration-none">← Retour</Link>
          </div>
        </div>
      </div>
    </div>
  );
}