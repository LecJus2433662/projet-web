'use client';

import { useState } from 'react';
import { usePanierContext } from '../Panier/panierContext';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './pageStripe.scss';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentForm({ items, total }: { items: any[]; total: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id:       i.id,       
            nom:      i.nom,
            prix:     i.prix,
            quantite: i.quantite,
          })),
          utilisateurId: '', 
        }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form className="checkout-form-card" onSubmit={handleSubmit}>
      <div className="secure-badge">
        <span>🔒 Paiement sécurisé — chiffrement SSL 256 bits</span>
        <span className="badge-test">Test</span>
      </div>
      <div className="test-card-box">
        <p className="test-label">Carte de test Stripe</p>
        <p className="test-num">4242 4242 4242 4242</p>
        <p className="test-detail">Date : n'importe quelle date future · CVC : 3 chiffres</p>
      </div>
      <p className="redirect-note">Vous serez redirigé vers Stripe pour finaliser.</p>
      {error && <div className="stripe-error">{error}</div>}
      <button type="submit" className="btn-payer" disabled={loading}>
        {loading ? 'Traitement...' : `Payer $${total.toFixed(2)}`}
      </button>
      <p className="terms-note">En cliquant, vous acceptez les conditions de paiement Stripe.</p>
    </form>
  );
}

// ✅ Export nommé Checkout pour que page.tsx continue de fonctionner
export default function Checkout() {
  const { items, viderPanier } = usePanierContext();
  const total = items.reduce((acc, i) => acc + i.prix * i.quantite, 0);

  if (items.length === 0) {
    return (
      <div className="checkout-wrapper text-center py-5">
        <p>Ton panier est vide.</p>
        <Link href="/">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <h1>Paiement</h1>
      <div className="checkout-grid">
        <div className="checkout-resume">
          <h2>Résumé</h2>
          {items.map((item: any) => (
            <div key={item.id} className="resume-item">
              <img src={item.image} alt={item.nom} />
              <div className="resume-nom">{item.nom}</div>
              <div className="resume-qty">{item.quantite}x</div>
              <div className="resume-prix">${(item.prix * item.quantite).toFixed(2)}</div>
            </div>
          ))}
          <div className="resume-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <Elements stripe={stripePromise}>
          <PaymentForm items={items} total={total} />
        </Elements>
      </div>
    </div>
  );
}