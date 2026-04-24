'use client';
import '../styles/globals.scss';
import Link from 'next/link';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { JSX } from 'react';

function Navbar(): JSX.Element {
  const { data: session } = useSession();

  return (
    <nav className="navbar-custom">
      <Link href="/" className="brand">🛍️ Boutique de 67</Link>
      <ul className="nav-links">
        <li><Link href="/">Boutique</Link></li>
        {session ? (
          <>
            <li><Link href="/admin">Admin</Link></li>
            <li>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
              >
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <li><Link href="/admin/login">Admin</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}