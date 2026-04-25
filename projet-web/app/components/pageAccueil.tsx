'use client';
import './pageAccueil.scss';
import { useState, useEffect } from 'react';
import $ from 'jquery';
import type { Produit } from '../interfacesPages';
import ProductCard from './productCard';

export default function pageAccueil() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [recherche, setRecherche] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/produits')
      .then((r) => r.json())
      .then((data: Produit[]) => { setProduits(data); setLoading(false); })
      .catch(() => setLoading(false));

      const $ = require('jquery');
    // jQuery : highlight de la search bar
    $('#search-input').on('focus', function () {
      $(this).parent().addClass('focused');
    }).on('blur', function () {
      $(this).parent().removeClass('focused');
    });

    return () => { $('#search-input').off('focus blur'); };
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
            <div className="spinner-border" style={{ color: 'hsla(333,100%,53%,1)' }} />
            <p className="mt-3 text-muted-custom">Chargement...</p>
          </div>
        ) : produitsFiltres.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ fontSize: '3rem' }}>😕</p>
            <p className="text-muted-custom">Aucun produit trouvé pour « {recherche} »</p>
          </div>
        ) : (
          <div className="row g-4">
            {produitsFiltres.map((produit) => (
              <div key={produit.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <ProductCard produit={produit} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}