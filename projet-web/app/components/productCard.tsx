import type { Produit } from '../interfacesPages';

interface Props { produit: Produit; }

export default function BlogCard({produit}: Props) {
  return (
    <div className="product-card card h-100 shadow-sm">
      <img
        src={``}
        alt={produit.nom}
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
            Stock: {produit.quantite}
          </span>
        </div>

        <a 
          href={`/produits/${produit.id}`} 
          className="btn btn-success w-100"
        >
          🛒 Acheter maintenant
        </a>
      </div>
    </div>
  );
}