'use client';
import './pageAccueil.scss';
import { useEffect } from 'react';
import { usePanierContext } from '../Panier/panierContext';
import type { Produit } from '../interfacesPages';
import ProductCard from './productCard';
import { useState } from 'react';

export default function PageAccueil() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [recherche, setRecherche] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const { ajouterAuPanier, ouvrirPanier } = usePanierContext();

  useEffect(() => {
    fetch('/api/produits')
      .then((r) => r.json())
      .then((data: Produit[]) => {
        setProduits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    import('jquery').then((jquery) => {
      const $ = jquery.default;
      $('#search-input')
        .on('focus', function () {
          $(this).parent().addClass('focused');
        })
        .on('blur', function () {
          $(this).parent().removeClass('focused');
        });
    });
  }, []);

  const produitsFiltres = produits.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <>
      <section className="boutique-hero">
        <h1>Boutique 67 ✨</h1>
        <p>Découvrez nos produits exclusifs</p>
      </section>

      <section className="section-main">
        <div className="mb-4" style={{ maxWidth: 500 }}>
          <input
            id="search-input"
            type="text"
            className="search-bar"
            placeholder="🔍 Rechercher un produit..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" />
            <p className="mt-3 text-muted-custom">Chargement...</p>
          </div>
        ) : produitsFiltres.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ fontSize: '3rem' }}>😕</p>
            <p>Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="row g-4">
            {produitsFiltres.map((produit) => (
              <div key={produit.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <ProductCard
                  produit={produit}
                  ajouterAuPanier={ajouterAuPanier}
                  ouvrirPanier={ouvrirPanier}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}