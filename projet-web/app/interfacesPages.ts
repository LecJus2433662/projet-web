export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  nbProduitRestant: number; 
  image: string;
}
export interface FormProduit {
  nom: string;
  description: string;
  prix: string;
  quantite: string;
  image: string;
  disponible: boolean;
}

export interface Props { produit: Produit; }

export interface PanierItem {
  id: number;
  nom: string;
  prix: number;
  image: string;
  quantite: number;
}


export type UserRole = 'admin' | 'utilisateur';

export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
  token: string;
}