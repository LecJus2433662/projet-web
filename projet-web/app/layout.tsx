import '../styles/globals.scss';
import { ReactNode } from 'react';
import Header from './components/header';

export const metadata = {
  title: 'MonShop',
  description: 'Boutique en ligne',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}