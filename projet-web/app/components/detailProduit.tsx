'use client';
import './detailProduit.scss';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Produit, PanierItem } from '../interfacesPages';
import { usePanierContext } from '../Panier/panierContext';


export default function DetailProduit() {
  const { ajouterAuPanier, ouvrirPanier } = usePanierContext();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const raw = localStorage.getItem('user');
  const userActuel = raw ? JSON.parse(raw) : null;
  const estAdmin = userActuel?.role === 'admin';

  const handleAcheter = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push(`/login?redirect=/`);
      return;
    }
    ajouterAuPanier({
      id: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      image: produit.image,
    });
    ouvrirPanier(); // ← ouvre le panier après ajout
  };

  useEffect(() => {
    fetch(`/api/produits/${id}`)
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
          <span className="detail-price">{produit.prix?.toFixed(2)} $</span>
          <p className="detail-desc">{produit.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="stock-info">📦 {produit.nbProduitRestant} en stock</span>
          </div>
          {!estAdmin &&
          <div className="detail-actions">
            {produit.nbProduitRestant > 0 ? (
              <button onClick={handleAcheter} className="btn-gradient text-decoration-none">
                💳 Acheter maintenant
              </button>
            ) : (
              <button className="btn-gradient" disabled>Rupture de stock</button>
            )}
          </div>}
            <Link href="/" className="btn-outline-gradient text-decoration-none">← Retour</Link>
          </div>
        </div>
      </div>
  );
}