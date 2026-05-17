'use client';
import './productCard.scss';
import { useRouter } from 'next/navigation';
import type { Produit, PanierItem } from '../interfacesPages';

interface Props {
  produit: Produit;
  ajouterAuPanier: (item: Omit<PanierItem, 'quantite'>) => void;
  ouvrirPanier: () => void;
}

export default function BlogCard({ produit, ajouterAuPanier, ouvrirPanier }: Props) {
  const router = useRouter();

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

  return (
    <div className="product-card card h-100 shadow-sm">
      <img
        src={produit.image}
        alt={produit.nom}
        style={{ width: '100%', height: '250px', objectFit: 'cover', objectPosition: 'center' }}
        className="card-img-top"
      />
      <div className="card-body">
        <h5 className="card-title">{produit.nom}</h5>
        <p className="card-text text-muted">{produit.description}</p>
      </div>
      <div className="card-footer">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="price-badge">${produit.prix}</span>
          <span className="badge bg-secondary">Stock: {produit.nbProduitRestant}</span>
        </div>
        <div className="d-flex flex-column gap-2">
          <button
            className="btn-outline-gradient w-100"
            onClick={() => router.push(`/produits/${produit.id}`)}
            style={{ background: '#1d4ed8', border: 'none', color: '#fff', padding: '.6rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', width: '100%' }}
          >
            Consulter
          </button>
          <button
            className="btn btn-success w-100"
            onClick={handleAcheter}
            disabled={produit.nbProduitRestant === 0}
          >
            🛒 Acheter maintenant
          </button>
        </div>
      </div>
    </div>
  );
}