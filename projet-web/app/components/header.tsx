'use client';

import './header.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Panier from './panier';
import { usePanier } from '../Panier/usePanier';

export default function Navbar() {
  const pathname = usePathname();

  const [panierOuvert, setPanierOuvert] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const ouvrirPanier = () => setPanierOuvert(true);
  const fermerPanier = () => setPanierOuvert(false)
  
  const {
    items,
    updateQuantite,
    supprimerDuPanier,
    viderPanier,
    nbItems
  } = usePanier();

  useEffect(() => {
    setMounted(true);

    const raw = localStorage.getItem('user');

    if (raw) {
      setUser(JSON.parse(raw));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'role=; path=/; max-age=0';

    window.location.href = '/';
  };

  // Empêche hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      <nav className="navbar-custom">
        <Link href="/" className="brand">
          MonShop
          <span className="brand-dot" />
        </Link>

        <ul className="nav-links">
          {user ? (
            <>
              {/* Admin */}
              {user.role === 'admin' && (
                <li>
                  <Link href="/admin">Admin</Link>
                </li>
              )}

              {/* Utilisateur */}
              {user.role === 'utilisateur' && (
                <>
                  <li>
                    <span className="welcome-msg">
                      Bonjour User
                    </span>
                  </li>

                  <li>
                    <button
                      className="btn-panier"
                      onClick={() => setPanierOuvert(true)}
                    >
                      🛒 Panier

                      {nbItems > 0 && (
                        <span className="panier-badge">
                          {nbItems}
                        </span>
                      )}
                    </button>
                  </li>
                </>
              )}

              <li>
                <button
                  className="btn-deconnexion"
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">Connexion</Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Widget panier */}
      {user?.role === 'utilisateur' && (
        <Panier
          isOpen={panierOuvert}
          onClose={() => setPanierOuvert(false)}
          items={items}
          onUpdateQty={updateQuantite}
          onDelete={supprimerDuPanier}
          onVider={viderPanier}
        />
      )}
    </>
  );
}