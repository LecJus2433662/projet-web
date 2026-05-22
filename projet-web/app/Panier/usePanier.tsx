'use client';
import { useState, useEffect } from 'react';
import type { PanierItem } from '../interfacesPages';
import { useCallback } from 'react';

const CLE = 'monshop_panier';

export function usePanier() {
    // ✅ Toujours démarrer avec [] pour éviter le mismatch SSR/client
    const [items, setItems] = useState<PanierItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // ✅ Hydrater depuis localStorage une fois côté client
    useEffect(() => {
        try {
            const raw = localStorage.getItem(CLE);
            if (raw) setItems(JSON.parse(raw));
        } catch {
            // ignore
        }
        setHydrated(true);
    }, []);

    // Sauvegarder à chaque changement (seulement après hydratation)
    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(CLE, JSON.stringify(items));
    }, [items, hydrated]);

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

    const viderPanier = useCallback(() => {
        setItems([]);
        localStorage.removeItem('monshop_panier'); // ✅ même clé que CLE
      }, []);

    const nbItems = items.reduce((acc, i) => acc + i.quantite, 0);

    return { items, ajouterAuPanier, updateQuantite, supprimerDuPanier, viderPanier, nbItems, hydrated };
}
