'use client';

import './header.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type User = {
  username: string;
  role: 'admin' | 'utilisateur';
};

export default function Header() {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  // 🔥 charge user + écoute changements
  useEffect(() => {
    const loadUser = () => {
      const raw = localStorage.getItem('user');

      if (raw) {
        try {
          const parsed = JSON.parse(raw);

          if (parsed?.role && parsed?.username) {
            setUser({
              username: parsed.username,
              role: parsed.role,
            });
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
    setMounted(true);

    // 🔥 écoute changements login/logout
    window.addEventListener('storage', loadUser);
    window.addEventListener('user-changed', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('user-changed', loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'role=; path=/; max-age=0';

    setUser(null);

    // 🔥 notify navbar update
    window.dispatchEvent(new Event('user-changed'));

    window.location.href = '/login';
  };

  const getGreeting = () => {
    if (!user) return '';
    return user.role === 'admin'
      ? `Bonjour admin 🛠️`
      : `Bonjour ${user.username} 👋`;
  };

  if (!mounted) {
    return (
      <nav className="navbar-custom">
        <Link href="/" className="brand">🛍️ MonShop</Link>
      </nav>
    );
  }

  return (
    <nav className="navbar-custom">
      <Link href="/" className="brand">🛍️ MonShop</Link>

      <ul className="nav-links">

        {/* 👋 greeting */}
        {user && (
          <li className="greeting">
            <span>{getGreeting()}</span>
          </li>
        )}

        {/* boutique */}
        <li>
          <Link
            href="/"
            style={{ fontWeight: pathname === '/' ? 800 : 600 }}
          >
            Boutique
          </Link>
        </li>

        {/* admin */}
        {user?.role === 'admin' && (
          <li>
            <Link href="/admin">Admin</Link>
          </li>
        )}

        {/* auth */}
        {user ? (
          <li>
            <button className="btn-deconnexion" onClick={handleLogout}>
              Déconnexion
            </button>
          </li>
        ) : (
          <li>
            <Link href="/login">Connexion</Link>
          </li>
        )}

      </ul>
    </nav>
  );
}