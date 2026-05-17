'use client';
import { useState, useEffect } from 'react';
import type { PanierItem } from '../interfacesPages';

const CLE = 'monshop_panier';

export function usePanier() {
    const [items, setItems] = useState<PanierItem[]>(() => {
        if (typeof window === 'undefined') return [];
        
        try {
          const raw = localStorage.getItem(CLE);
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      });

  // Sauvegarder à chaque changement
  useEffect(() => {
    localStorage.setItem(CLE, JSON.stringify(items));
  }, [items]);

  const ajouterAuPanier = (item: Omit<PanierItem, 'quantite'>) => {
    setItems((prev) => {
      const existant = prev.find((i) => i.id === item.id);
      if (existant) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantite: i.quantite + 1 } : i
        );
      }
      return [...prev, { ...item, quantite: 1 }];
    });
  };

  const updateQuantite = (id: number, qty: number) => {
    if (qty <= 0) {
      supprimerDuPanier(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantite: qty } : i))
    );
  };

  const supprimerDuPanier = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const viderPanier = () => setItems([]);

  const nbItems = items.reduce((acc, i) => acc + i.quantite, 0);

  return { items, ajouterAuPanier, updateQuantite, supprimerDuPanier, viderPanier, nbItems };
}