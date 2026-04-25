'use client';
import './Achat.scss';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Produit } from '../interfacesPages';

export default function Achat() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [enCours, setEnCours] = useState<boolean>(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/produits/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: Produit) => { setProduit(data); setLoading(false); })
      .catch(() => router.push('/erreur?raison=produit-introuvable'));
  }, [id, router]);

  const handleAchat = async () => {
    if (!produit) return;
    setEnCours(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produitId: produit.id, nom: produit.nom, prix: produit.prix, image: produit.image }),
      });
      const data: { url?: string } = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { router.push('/erreur?raison=erreur-paiement'); }
    } catch {
      router.push('/erreur?raison=erreur-paiement');
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: 'hsla(333,100%,53%,1)' }} />
    </div>
  );
  if (!produit) return <></>;

  return (
    <div className="achat-wrapper">
      <Link href={`/produits/${id}`} style={{ color: 'hsla(333,100%,53%,1)', textDecoration: 'none', fontSize: '.9rem' }}>
        ← Retour au produit
      </Link>
      <div className="achat-card mt-3">
        <h2>💳 Confirmation d'achat</h2>
        <div className="achat-produit">
          <img src={produit.image || '/placeholder.jpg'} alt={produit.nom} />
          <div>
            <div className="achat-nom">{produit.nom}</div>
            <div className="achat-prix">{produit.prix.toFixed(2)} $</div>
          </div>
        </div>
        <div className="stripe-notice">
          🔒 Paiement sécurisé via <strong style={{ color: 'var(--text)' }}>Stripe</strong>. Tu seras redirigé vers leur page de paiement sécurisée.
        </div>
        <button className="btn-gradient w-100" onClick={handleAchat} disabled={enCours}>
          {enCours ? '⏳ Redirection...' : '✅ Procéder au paiement'}
        </button>
      </div>
    </div>
  );
}