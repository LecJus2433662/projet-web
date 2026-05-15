'use client';
import './productCard.scss';
import { useRouter } from 'next/navigation';
import type { Produit } from '../interfacesPages';

interface Props { produit: Produit; }

export default function BlogCard({ produit }: Props) {
  const router = useRouter();

  const handleAcheter = () => {
    const token = document.cookie.match(/token=([^;]+)/)?.[1];

    if (!token) {
      router.push(`/login?redirect=/produits/${produit.id}`);
      return;
    }

    router.push(`/produits/${produit.id}`);
  };

  return (
    <div className="product-card card h-100 shadow-sm">
      <img
        src={produit.image}
        alt={produit.nom}
        style={{
          width: "100%",
          height: "250px",
          objectFit: "cover",
          objectPosition: "center"
        }}
        className="card-img-top"
      />

      <div className="card-body">
        <h5 className="card-title">{produit.nom}</h5>
        <p className="card-text text-muted">{produit.description}</p>
      </div>

      <div className="card-footer">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="price-badge">
            ${produit.prix}
          </span>

          <span className="badge bg-secondary">
            Stock: {produit.nbProduitRestant}
          </span>
        </div>

        <div className="d-flex flex-column gap-2">
          <button
            className="btn-outline-gradient w-100"
            onClick={() => router.push(`/detailProduit/${produit.id}`)}
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