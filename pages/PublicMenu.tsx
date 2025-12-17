import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Category, Product, CartItem } from '../types';
import { Icons } from '../components/Icons';
import { Logo } from '../components/Logo';

export const PublicMenu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');

  useEffect(() => {
    setCategories(StorageService.getCategories());
    setProducts(StorageService.getProducts());
    
    // Optional: Load cart from local storage if needed
    const savedCart = localStorage.getItem('burgerhub_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('burgerhub_cart', JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- Cart Functions ---

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Visual feedback could be added here
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const updateObservation = (id: string, obs: string) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, observation: obs } : item
    ));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // --- WhatsApp Integration ---

  const handleFinishOrder = () => {
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome.');
      return;
    }
    if (!address.trim()) {
        alert('Por favor, informe seu endereço ou número da mesa.');
        return;
    }

    const phoneNumber = "5511999999999"; // Replace with real admin number
    
    let message = `*🍔 NOVO PEDIDO - KING BURGUER*\n`;
    message += `--------------------------------\n`;
    message += `*Cliente:* ${customerName}\n`;
    message += `*Local:* ${address}\n`;
    message += `*Pagamento:* ${paymentMethod === 'pix' ? 'PIX' : paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'}\n`;
    message += `--------------------------------\n\n`;
    
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name}\n`;
      if (item.observation) {
        message += `   _Obs: ${item.observation}_\n`;
      }
      message += `   R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
    });
    
    message += `--------------------------------\n`;
    message += `*💰 TOTAL: R$ ${cartTotal.toFixed(2).replace('.', ',')}*\n`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Optional: Clear cart after sending
    // setCart([]);
    // setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-secondary shadow-lg sticky top-0 z-20 pb-2 border-b-4 border-primary">
        <div className="container mx-auto px-4 pt-4 pb-2 flex justify-center md:justify-start items-center relative">
          <div className="flex-1 flex justify-center md:justify-start">
             <Logo />
          </div>
        </div>

        {/* Search Bar */}
        <div className="container mx-auto px-4 pb-4">
          <div className="relative max-w-md mx-auto md:mx-0">
            <input
              type="text"
              placeholder="O que você procura hoje?"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-white bg-gray-800 border-none focus:ring-4 focus:ring-primary/50 shadow-lg placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icons.Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>
      </header>

      {/* Category Nav */}
      <nav className="bg-white shadow-sm sticky top-[136px] z-10 overflow-hidden border-b border-gray-100">
        <div className="container mx-auto py-3 px-4 overflow-x-auto no-scrollbar flex space-x-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-secondary text-primary shadow-md transform scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-primary hover:text-black'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-black shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-primary hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-display text-gray-800 mb-6 drop-shadow-sm flex items-center gap-2">
          <span className="text-primary">l</span>
          {activeCategory === 'all' 
            ? 'Destaques do Cardápio' 
            : categories.find(c => c.id === activeCategory)?.name}
        </h2>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-6xl mb-4 grayscale">🍔</div>
            <p className="text-lg font-medium">Nenhum produto encontrado.</p>
            <p className="text-sm">Tente buscar por outro termo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group border border-gray-100 ${!product.isAvailable ? 'opacity-75 grayscale-[0.8]' : ''}`}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-black text-white px-4 py-1.5 rounded-sm text-sm font-bold uppercase tracking-wider border border-white/20">
                        Esgotado
                      </span>
                    </div>
                  )}
                  {product.isAvailable && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm border-l-4 border-primary">
                       {categories.find(c => c.id === product.categoryId)?.name}
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex flex-col items-end">
                      <span className="font-display text-xl text-gray-900">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-5 line-clamp-2 flex-1 leading-relaxed">{product.description}</p>
                  
                  {product.isAvailable ? (
                    <button 
                        onClick={() => addToCart(product)}
                        className="w-full mt-auto bg-primary hover:bg-yellow-400 active:bg-yellow-500 text-black font-extrabold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-200 transform active:scale-95"
                    >
                      <span>ADICIONAR</span>
                      <Icons.Plus className="w-5 h-5" />
                    </button>
                  ) : (
                    <button disabled className="w-full mt-auto bg-gray-100 text-gray-400 font-semibold py-3 px-4 rounded-xl cursor-not-allowed border border-gray-200">
                      Indisponível no momento
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-bounce-slow">
            <button 
                onClick={() => setIsCartOpen(true)}
                className="bg-primary text-black p-4 rounded-full shadow-2xl hover:bg-yellow-400 transition-transform hover:scale-110 flex items-center justify-center relative border-4 border-black"
            >
                <Icons.ShoppingBag className="w-8 h-8" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white min-w-[24px]">
                    {cartCount}
                </span>
            </button>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
                {/* Cart Header */}
                <div className="bg-secondary p-5 flex items-center justify-between border-b-4 border-primary">
                    <h2 className="text-white text-xl font-display flex items-center gap-2">
                        <Icons.ShoppingBag className="w-6 h-6 text-primary" />
                        Seu Pedido
                    </h2>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Icons.X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Icons.ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                            <p>Seu carrinho está vazio.</p>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 text-primary font-bold hover:underline"
                            >
                                Ver Cardápio
                            </button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex gap-3">
                                <img src={item.image} alt="" className="w-20 h-20 rounded-lg object-cover bg-gray-200" />
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 leading-tight">{item.name}</h4>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <Icons.Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-primary font-bold text-sm">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                    
                                    <div className="mt-auto flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-2 py-1 shadow-sm">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="text-gray-500 hover:text-black"
                                            >
                                                <Icons.Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="text-gray-500 hover:text-black"
                                            >
                                                <Icons.Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Observation Input */}
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Sem cebola..." 
                                        className="mt-2 text-xs w-full bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary"
                                        value={item.observation || ''}
                                        onChange={(e) => updateObservation(item.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {cart.length > 0 && (
                    <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                         <div className="mb-4 space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Seu Nome</label>
                                <input 
                                    type="text" 
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Digite seu nome"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Endereço de Entrega ou Mesa</label>
                                <input 
                                    type="text" 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Rua, Número e Bairro"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Forma de Pagamento</label>
                                <select 
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none text-sm"
                                >
                                    <option value="pix">PIX</option>
                                    <option value="card">Cartão (Máquininha)</option>
                                    <option value="cash">Dinheiro</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 font-medium">Total do Pedido</span>
                            <span className="text-2xl font-display text-gray-900">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        
                        <button 
                            onClick={handleFinishOrder}
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Icons.WhatsApp className="w-6 h-6" />
                            <span>ENVIAR PEDIDO</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
      
      <footer className="bg-secondary text-gray-400 py-10 mt-12 text-center text-sm border-t-4 border-primary">
        <div className="opacity-80 mb-4 transform scale-75 origin-center">
            <Logo />
        </div>
        <p>© 2024 King Burguer. Todos os direitos reservados.</p>
        <p className="mt-2 text-xs text-gray-600">Imagens meramente ilustrativas.</p>
      </footer>
    </div>
  );
};