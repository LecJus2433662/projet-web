'use client';
import './pageStripe.scss';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePanier } from '../Panier/usePanier';
import Link from 'next/link';

interface FormData {
  email: string;
  nom: string;
  numerocarte: string;
  expiration: string;
  cvv: string;
}

export default function Checkout() {
  const router = useRouter();
  const { items, viderPanier } = usePanier();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    email: '',
    nom: '',
    numerocarte: '4242 4242 4242 4242',
    expiration: '',
    cvv: '',
  });

  const total = items.reduce((acc, i) => acc + i.prix * i.quantite, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation paiement Stripe test (2 secondes)
    await new Promise((res) => setTimeout(res, 2000));

    viderPanier();
    router.push('/succesAchat');
  };

  if (items.length === 0) {
    return (
      <div className="checkout-wrapper text-center py-5">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Ton panier est vide.
        </p>
        <Link href="/" className="btn-gradient text-decoration-none">
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <h1>Paiement</h1>

      <div className="checkout-grid">

        {/* Résumé commande */}
        <div className="checkout-resume">
          <h2>Résumé de la commande</h2>
          {items.map((item) => (
            <div key={item.id} className="resume-item">
              <img src={item.image || '/placeholder.jpg'} alt={item.nom} />
              <div className="resume-info">
                <div className="resume-nom">{item.nom}</div>
                <div className="resume-qty">Qté : {item.quantite}</div>
              </div>
              <div className="resume-prix">${(item.prix * item.quantite).toFixed(2)}</div>
            </div>
          ))}
          <div className="resume-total">
            <span className="total-label">Total</span>
            <span className="total-montant">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Formulaire paiement */}
        <form className="checkout-form-card" onSubmit={handleSubmit}>
          <h2>Informations de paiement</h2>

          <div className="stripe-badge">
            <span className="stripe-logo">stripe</span>
            Paiement sécurisé par Stripe
          </div>

          <p className="form-section-label">Contact</p>

          <div className="form-group">
            <label>Adresse courriel</label>
            <input name="email" type="email" placeholder="toi@exemple.com" value={form.email} onChange={handleChange} required />
          </div>

          <p className="form-section-label">Carte de crédit</p>

          <div className="form-group card-field">
            <label>Numéro de carte</label>
            <input
              name="numerocarte"
              type="text"
              placeholder="4242 4242 4242 4242"
              value={form.numerocarte}
              onChange={handleChange}
              maxLength={19}
              required
            />
            <span className="card-icon">💳</span>
          </div>

          <div className="form-group">
            <label>Nom sur la carte</label>
            <input name="nom" type="text" placeholder="Jean Dupont" value={form.nom} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiration</label>
              <input name="expiration" type="text" placeholder="MM/AA" value={form.expiration} onChange={handleChange} maxLength={5} required />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input name="cvv" type="text" placeholder="123" value={form.cvv} onChange={handleChange} maxLength={3} required />
            </div>
          </div>

          <button type="submit" className="btn-payer" disabled={loading}>
            {loading ? '⏳ Traitement...' : `💳 Payer $${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}