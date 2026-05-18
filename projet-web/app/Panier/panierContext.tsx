'use client';
import { createContext, useContext, useState } from 'react';
import { usePanier } from './usePanier';

type PanierContextType = ReturnType<typeof usePanier> & {
  panierOuvert: boolean;
  ouvrirPanier: () => void;
  fermerPanier: () => void;
};

const PanierContext = createContext<PanierContextType | null>(null);

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const panier = usePanier();
  const [panierOuvert, setPanierOuvert] = useState(false);

  return (
    <PanierContext.Provider value={{
      ...panier,
      panierOuvert,
      ouvrirPanier: () => setPanierOuvert(true),
      fermerPanier: () => setPanierOuvert(false),
    }}>
      {children}
    </PanierContext.Provider>
  );
}

export function usePanierContext() {
  const ctx = useContext(PanierContext);
  if (!ctx) throw new Error('usePanierContext doit être utilisé dans PanierProvider');
  return ctx;
}