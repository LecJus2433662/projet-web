'use client';
import './Succes.scss';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Succes() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');

  return (
    <div className="succes-wrapper">
      <div className="succes-card">
        <div className="succes-icon">🎉</div>
        <h1>Paiement réussi !</h1>
        <p>Merci pour ton achat ! Tu recevras une confirmation par courriel sous peu.</p>
        {sessionId && (
          <p className="ref">
            Référence : <code>{sessionId.slice(0, 20)}...</code>
          </p>
        )}
        <Link href="/" className="btn-gradient text-decoration-none">
          Retourner à la boutique
        </Link>
      </div>
    </div>
  );
}