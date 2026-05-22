'use client';
import './succesAchat.scss';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { usePanierContext } from '../Panier/panierContext';
import { useEffect, useRef, useState } from 'react';

export default function Succes() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const { items, viderPanier } = usePanierContext();
  const dejaTraite = useRef(false);
  const [statut, setStatut] = useState<'chargement' | 'ok' | 'erreur'>('chargement');

  useEffect(() => {
    if (!sessionId || dejaTraite.current) return;
    dejaTraite.current = true;

    const confirmer = async () => {
      try {
        const res = await fetch('/api/confirm-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            items: items.map(i => ({   // ✅ items viennent du panier directement
              ProduitId: i.id,
              Nom: i.nom,
              Prix: i.prix,
              Quantite: i.quantite,
            })),
          }),
        });

        if (res.ok) {
          viderPanier();
          setStatut('ok');
        } else {
          setStatut('erreur');
        }
      } catch {
        setStatut('erreur');
      }
    };

    confirmer();
  }, [sessionId]);

  return (
    <div className="succes-wrapper">
      <div className="succes-card">
        {statut === 'chargement' && <p>Confirmation en cours...</p>}

        {statut === 'ok' && (
          <>
            <div className="succes-icon">🎉</div>
            <h1>Paiement réussi !</h1>
            <p>Merci pour ton achat !</p>
            <Link href="/" className="btn-gradient text-decoration-none">
              Retourner à la boutique
            </Link>
          </>
        )}

        {statut === 'erreur' && (
          <>
            <div className="succes-icon">⚠️</div>
            <h1>Erreur de confirmation</h1>
            <p>Ton paiement a été reçu. Contacte le support avec ta référence.</p>
            {sessionId && <p><code>{sessionId.slice(0, 20)}</code></p>}
          </>
        )}
      </div>
    </div>
  );
}