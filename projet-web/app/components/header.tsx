'use client';

import './header.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Panier from './panier';
import { usePanierContext } from '../Panier/panierContext';

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  const {
    items,
    updateQuantite,
    supprimerDuPanier,
    viderPanier,
    nbItems,
    panierOuvert,
    ouvrirPanier,
    fermerPanier,
  } = usePanierContext();

  const lireUser = () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setMounted(true);
    setUser(lireUser());

    const handleUserChanged = () => setUser(lireUser());
    window.addEventListener('user-changed', handleUserChanged);

    return () => window.removeEventListener('user-changed', handleUserChanged);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'role=; path=/; max-age=0';
    setUser(null);
    window.dispatchEvent(new Event('user-changed'));
    window.location.href = '/';
  };

  if (!mounted) return null;

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
              {user.role === 'admin' && (
                <li>
                  <Link href="/admin">Admin</Link>
                </li>
              )}

              {user.role === 'utilisateur' && (
                <>
                  <li>
                    <span className="welcome-msg">Bonjour User</span>
                  </li>

                  <li>
                    <button className="btn-panier" onClick={ouvrirPanier}>
                      🛒 Panier
                      {nbItems > 0 && (
                        <span className="panier-badge">{nbItems}</span>
                      )}
                    </button>
                  </li>
                </>
              )}

              <li>
                <button className="btn-deconnexion" onClick={handleLogout}>
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

      {user?.role === 'utilisateur' && (
        <Panier
          isOpen={panierOuvert}
          onClose={fermerPanier}
          items={items}
          onUpdateQty={updateQuantite}
          onDelete={supprimerDuPanier}
          onVider={viderPanier}
        />
      )}
    </>
  );
}