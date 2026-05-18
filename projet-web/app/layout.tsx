import '../styles/globals.scss';
import { ReactNode } from 'react';
import Header from './components/header';
import { PanierProvider } from './Panier/panierContext';

export const metadata = {
  title: 'MonShop',
  description: 'Boutique en ligne',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
      <PanierProvider>
        <Header />
        <main>{children}</main>
      </PanierProvider>
      </body>
    </html>
  );
}