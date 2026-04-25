export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  quantite: number;
  image: string;
  disponible: boolean;
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



export type UserRole = 'admin' | 'utilisateur';

export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
  token: string;
}