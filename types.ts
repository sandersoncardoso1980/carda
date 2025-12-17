export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  isAvailable: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  observation?: string;
}

export type ViewMode = 'grid' | 'list';