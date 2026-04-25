'use client';
import './adminDashboard.scss';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Produit } from '../interfacesPages';

export default function AdminDashboard() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/produits')
      .then((r) => r.json())
      .then((data: Produit[]) => { setProduits(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="section-main admin-dashboard">
      <div className="admin-header">
        <h1>🛠️ Gestion des produits</h1>
        <Link href="/admin/ajouter" className="btn-gradient text-decoration-none">+ Ajouter un produit</Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: 'hsla(333,100%,53%,1)' }} />
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th><th>Nom</th><th>Prix</th><th>Stock</th><th>Statut</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((p) => (
                <tr key={p.id}>
                  <td className="td-img"><img src={p.image || '/placeholder.jpg'} alt={p.nom} /></td>
                  <td style={{ fontWeight: 600 }}>{p.nom}</td>
                  <td className="td-prix">{p.prix.toFixed(2)} $</td>
                  <td>{p.quantite}</td>
                  <td><span className={`dispo-badge ${p.disponible ? 'dispo' : 'indispo'}`}>{p.disponible ? 'Disponible' : 'Indisponible'}</span></td>
                  <td>
                    <Link href={`/admin/modifier/${p.id}`} className="btn-gradient text-decoration-none" style={{ fontSize: '.85rem', padding: '.4rem 1rem' }}>
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {produits.length === 0 && <p className="text-center text-muted-custom py-4">Aucun produit.</p>}
        </div>
      )}
    </div>
  );
}