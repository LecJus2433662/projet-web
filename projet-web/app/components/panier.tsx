'use client';
import './panier.scss';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PanierItem } from '../interfacesPages';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    items: PanierItem[];
    onUpdateQty: (id: number, qty: number) => void;
    onDelete: (id: number) => void;
    onVider: () => void;
}

export default function Panier({ isOpen, onClose, items, onUpdateQty, onDelete, onVider }: Props) {
    const router = useRouter();
    const drawerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fermer en cliquant outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, onClose]);

    // Bloquer le scroll quand ouvert
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const total = items.reduce((acc, item) => acc + item.prix * item.quantite, 0);
    const nbItems = items.reduce((acc, item) => acc + item.quantite, 0);

    const handleCheckout = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            onClose();
            router.push('/login?redirect=/checkout');
            return;
        }

        onClose();
        router.push('/stripe');
    };

    return (
        <>
            <div className={`panier-overlay ${isOpen ? 'open' : ''}`} />

            <div className={`panier-drawer ${isOpen ? 'open' : ''}`} ref={drawerRef}>

                {/* Header */}
                <div className="panier-header">
                    <div className="panier-titre">
                        🛒 Mon panier

                        {mounted && nbItems > 0 && (
                            <span className="panier-count">{nbItems}</span>
                        )}
                    </div>
                    <button className="panier-close" onClick={onClose}>✕</button>
                </div>

                {/* Body */}
                {items.length === 0 ? (
                    <div className="panier-vide">
                        <div className="vide-icon">🛍️</div>
                        <p>Ton panier est vide.<br />Ajoute des produits pour commencer !</p>
                    </div>
                ) : (
                    <div className="panier-body">
                        {items.map((item) => (
                            <div key={item.id} className="panier-item">
                                <img src={item.image || '/placeholder.jpg'} alt={item.nom} />

                                <div className="item-info">
                                    <div className="item-nom">{item.nom}</div>
                                    <div className="item-prix">${(item.prix * item.quantite).toFixed(2)}</div>
                                </div>

                                <div className="item-controls">
                                    <button
                                        className="qty-btn"
                                        onClick={() => onUpdateQty(item.id, item.quantite - 1)}
                                    >
                                        −
                                    </button>
                                    <span className="qty-value">{item.quantite}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => onUpdateQty(item.id, item.quantite + 1)}
                                    >
                                        +
                                    </button>
                                    <button
                                        className="item-delete"
                                        onClick={() => onDelete(item.id)}
                                        title="Retirer"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                {items.length > 0 && (
                    <div className="panier-footer">
                        <div className="panier-total-row">
                            <span className="total-label">Total</span>
                            <span className="total-amount">${total.toFixed(2)}</span>
                        </div>
                        <button className="btn-checkout" onClick={handleCheckout}>
                            Passer au paiement →
                        </button>
                        <button className="btn-vider" onClick={onVider}>
                            Vider le panier
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}