'use client';
import './Erreur.scss';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface MessageErreur { emoji: string; titre: string; desc: string; }

const MESSAGES: Record<string, MessageErreur> = {
  'produit-introuvable': { emoji: '🔍', titre: 'Produit introuvable',   desc: "Ce produit n'existe pas ou a été retiré de la boutique." },
  'erreur-paiement':     { emoji: '💳', titre: 'Erreur de paiement',    desc: "Une erreur est survenue lors du paiement. Aucun montant n'a été débité." },
  'acces-refuse':        { emoji: '🚫', titre: 'Accès refusé',          desc: "Tu n'as pas la permission d'accéder à cette page." },
  default:               { emoji: '⚠️', titre: 'Une erreur est survenue', desc: "Quelque chose s'est mal passé. Réessaie ou retourne à la boutique." },
};

export default function Erreur() {
  const params = useSearchParams();
  const raison = params.get('raison') ?? 'default';
  const msg = MESSAGES[raison] ?? MESSAGES.default;

  return (
    <div className="erreur-wrapper">
      <div className="erreur-card">
        <div className="erreur-icon">{msg.emoji}</div>
        <h1>{msg.titre}</h1>
        <p>{msg.desc}</p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link href="/" className="btn-gradient text-decoration-none">← Boutique</Link>
          <button className="btn-outline-gradient" onClick={() => window.history.back()}>Réessayer</button>
        </div>
      </div>
    </div>
  );
}