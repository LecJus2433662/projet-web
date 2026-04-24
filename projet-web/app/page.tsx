'use client';
import { useState, useEffect, JSX } from 'react';
import Link from 'next/link';
import $ from 'jquery';
import type { Produit } from './api/types/index';

export default function Boutique(): JSX.Element {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [recherche, setRecherche] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/produits')
      .then((r) => r.json())
      .then((data: Produit[]) => {
        setProduits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    $(document).on('mouseenter', '.product-card', function () {
      $(this).find('.btn-purple').css('letter-spacing', '0.05em');
    }).on('mouseleave', '.product-card', function () {
      $(this).find('.btn-purple').css('letter-spacing', 'normal');
    });

    return () => {
      $(document).off('mouseenter mouseleave', '.product-card');
    };
  }, []);

  const produitsFiltres: Produit[] = produits.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <>
      <section className="hero-section">
        <h1>Notre Boutique</h1>
        <p>Découvrez nos produits exclusifs ✨</p>
      </section>

      <section className="section-main">
        <div className="mb-4" style={{ maxWidth: 500 }}>
          <input
            type="text"
            className="search-bar"
            placeholder="🔍 Rechercher un produit..."
            value={recherche}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecherche(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--primary)' }} />
            <p className="mt-3 text-muted-custom">Chargement des produits...</p>
          </div>
        ) : produitsFiltres.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ fontSize: '3rem' }}>😕</p>
            <p className="text-muted-custom">Aucun produit trouvé pour « {recherche} »</p>
          </div>
        ) : (
          <div className="row g-4">
            {produitsFiltres.map((produit: Produit) => (
              <div key={produit.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className="product-card">
                  <img
                    src={produit.image || '/placeholder.jpg'}
                    alt={produit.nom}
                    className="card-img-top"
                  />
                  <div className="card-body d-flex flex-column gap-2">
                    <h3 className="card-title">{produit.nom}</h3>
                    <span className="price-badge">{produit.prix.toFixed(2)} $</span>
                    <span className={`dispo-badge ${produit.disponible ? 'dispo' : 'indispo'}`}>
                      {produit.disponible ? '✅ Disponible' : '❌ Indisponible'}
                    </span>
                    <Link
                      href={`/produits/${produit.id}`}
                      className="btn-purple mt-auto text-center text-decoration-none"
                      style={{ display: 'block' }}
                    >
                      Consulter
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}