import { Category, Product } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Hambúrgueres', slug: 'hamburgueres' },
  { id: '2', name: 'Pizzas', slug: 'pizzas' },
  { id: '3', name: 'Salgados', slug: 'salgados' },
  { id: '4', name: 'Macarrão', slug: 'macarrao' },
  { id: '5', name: 'Sucos', slug: 'sucos' },
  { id: '6', name: 'Refrigerantes', slug: 'refrigerantes' },
  { id: '7', name: 'Cervejas', slug: 'cervejas' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '101',
    name: 'X-Bacon Supremo',
    description: 'Pão brioche, 2 blends de 150g, muito bacon crocante, queijo cheddar e maionese da casa.',
    price: 32.90,
    image: 'https://picsum.photos/400/300?random=1',
    categoryId: '1',
    isAvailable: true,
  },
  {
    id: '102',
    name: 'Smash Salad',
    description: 'Pão de batata, blend de 100g, alface americana, tomate, cebola roxa e queijo prato.',
    price: 24.50,
    image: 'https://picsum.photos/400/300?random=2',
    categoryId: '1',
    isAvailable: true,
  },
  {
    id: '103',
    name: 'Pizza Calabresa',
    description: 'Massa fina, molho de tomate, mussarela, calabresa fatiada e cebola.',
    price: 45.00,
    image: 'https://picsum.photos/400/300?random=3',
    categoryId: '2',
    isAvailable: true,
  },
  {
    id: '104',
    name: 'Suco de Laranja Natural',
    description: '500ml de suco espremido na hora. Sem açúcar.',
    price: 12.00,
    image: 'https://picsum.photos/400/300?random=4',
    categoryId: '5',
    isAvailable: true,
  },
  {
    id: '105',
    name: 'Coca-Cola Lata',
    description: '350ml gelada.',
    price: 6.00,
    image: 'https://picsum.photos/400/300?random=5',
    categoryId: '6',
    isAvailable: true,
  },
  {
    id: '106',
    name: 'Heineken Long Neck',
    description: '330ml. Produto para maiores de 18 anos.',
    price: 14.00,
    image: 'https://picsum.photos/400/300?random=6',
    categoryId: '7',
    isAvailable: true,
  },
];