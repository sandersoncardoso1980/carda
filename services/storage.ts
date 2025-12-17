import { Category, Product } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../constants';

const KEYS = {
  CATEGORIES: 'burgerhub_categories',
  PRODUCTS: 'burgerhub_products',
  AUTH: 'burgerhub_auth',
};

// Initialize data if empty
const initialize = () => {
  const cats = localStorage.getItem(KEYS.CATEGORIES);
  const prods = localStorage.getItem(KEYS.PRODUCTS);

  if (!cats) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!prods) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
};

initialize();

export const StorageService = {
  getCategories: (): Category[] => {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },

  saveCategory: (category: Category): void => {
    const categories = StorageService.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  deleteCategory: (id: string): void => {
    const categories = StorageService.getCategories().filter((c) => c.id !== id);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  saveProduct: (product: Product): void => {
    const products = StorageService.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  deleteProduct: (id: string): void => {
    const products = StorageService.getProducts().filter((p) => p.id !== id);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },
};