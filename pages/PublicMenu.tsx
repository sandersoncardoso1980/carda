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
  const [scrolled, setScrolled] = useState(false);
  
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
    
    const savedCart = localStorage.getItem('burgerhub_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

    const phoneNumber = "5511999999999"; 
    
    let message = `*🔥 PEDIDO KING BURGUER*\n`;
    message += `--------------------------------\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📍 *Local:* ${address}\n`;
    message += `💳 *Pagamento:* ${paymentMethod === 'pix' ? 'PIX' : paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'}\n`;
    message += `--------------------------------\n\n`;
    
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name}\n`;
      if (item.observation) {
        message += `   📝 _${item.observation}_\n`;
      }
      message += `   R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
    });
    
    message += `--------------------------------\n`;
    message += `*💰 TOTAL: R$ ${cartTotal.toFixed(2).replace('.', ',')}*\n`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-20 font-sans selection:bg-primary selection:text-black">
      
      {/* Modern Glass Header */}
      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${scrolled ? 'glass-dark shadow-xl py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className={`transition-all duration-300 ${scrolled ? 'scale-75 origin-left' : 'scale-100'}`}>
             <Logo />
          </div>
          
          <div className={`relative transition-all duration-300 ${scrolled ? 'w-48 md:w-64' : 'w-0 opacity-0 overflow-hidden md:w-64 md:opacity-100'}`}>
             {scrolled && (
               <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full pl-9 pr-4 py-2 rounded-full text-sm text-white bg-gray-800/50 border border-gray-700 focus:ring-2 focus:ring-primary outline-none backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Icons.Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
               </div>
             )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black">
            <img 
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop" 
                alt="Hero Burger" 
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F3F4F6] via-transparent to-black/80"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col items-center md:items-start pt-24">
            <div className="container mx-auto">
                <span className="inline-block px-3 py-1 bg-primary text-black text-xs font-bold rounded-full mb-3 tracking-wider animate-fade-in-up">
                    ABERTO TODOS OS DIAS
                </span>
                <h1 className="text-4xl md:text-6xl font-display text-white mb-2 drop-shadow-lg animate-fade-in-up [animation-delay:100ms]">
                    O VERDADEIRO <br/><span className="text-primary">SABOR DO REI</span>
                </h1>
                <p className="text-gray-200 text-sm md:text-lg max-w-md animate-fade-in-up [animation-delay:200ms]">
                    Ingredientes selecionados, carne suculenta e molhos artesanais que você só encontra aqui.
                </p>

                {/* Main Search Bar (Visible when not scrolled) */}
                <div className={`relative w-full max-w-lg mt-6 animate-fade-in-up [animation-delay:300ms] ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <input
                    type="text"
                    placeholder="O que você deseja comer hoje?"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl text-white bg-white/10 border border-white/20 focus:bg-black/80 focus:ring-2 focus:ring-primary backdrop-blur-md shadow-2xl placeholder-gray-300 transition-all text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Icons.Search className="w-6 h-6 text-primary absolute left-4 top-4" />
                </div>
            </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-[60px] md:top-[70px] z-20 bg-[#F3F4F6]/90 backdrop-blur-md border-b border-gray-200 shadow-sm py-2">
        <div className="container mx-auto overflow-x-auto no-scrollbar px-4 flex space-x-2 py-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-black text-primary shadow-lg scale-105 ring-2 ring-primary/50'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            🔥 Destaques
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-black text-primary shadow-lg scale-105 ring-2 ring-primary/50'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
           <div className="h-8 w-1 bg-primary rounded-full"></div>
           <h2 className="text-2xl md:text-3xl font-display text-gray-900">
            {activeCategory === 'all' 
                ? 'Nosso Cardápio' 
                : categories.find(c => c.id === activeCategory)?.name}
           </h2>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4 grayscale opacity-50">🍔</div>
            <p className="text-xl font-bold text-gray-800">Ops! Nada por aqui.</p>
            <p className="text-gray-500">Tente buscar por outro termo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 relative animate-fade-in-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Area */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Status Badge */}
                  {!product.isAvailable ? (
                    <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border border-red-400">
                        Esgotado
                      </span>
                    </div>
                  ) : (
                     <div className="absolute top-4 left-4 z-20">
                        <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold border border-white/10 shadow-sm">
                           {categories.find(c => c.id === product.categoryId)?.name}
                        </span>
                     </div>
                  )}

                  {/* Price Tag (Floating) */}
                  <div className="absolute bottom-4 right-4 z-20 bg-primary text-black px-4 py-2 rounded-xl font-display text-xl shadow-lg transform group-hover:-translate-y-1 transition-transform border-2 border-white">
                     R$ {product.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed font-light">
                    {product.description}
                  </p>
                  
                  {product.isAvailable ? (
                    <button 
                        onClick={() => addToCart(product)}
                        className="w-full mt-auto bg-gray-900 hover:bg-primary hover:text-black text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md active:scale-95"
                    >
                      <span className="text-sm tracking-wide">ADICIONAR AO PEDIDO</span>
                      <Icons.Plus className="w-5 h-5 transition-transform group-hover/btn:rotate-90" />
                    </button>
                  ) : (
                    <button disabled className="w-full mt-auto bg-gray-100 text-gray-400 font-semibold py-3.5 px-4 rounded-xl cursor-not-allowed border border-gray-200 text-sm">
                      Indisponível
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
                className="group relative bg-black hover:bg-gray-800 text-primary p-4 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all hover:scale-110 flex items-center justify-center border-2 border-primary"
            >
                <Icons.ShoppingBag className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-black">
                    {cartCount}
                </span>
                <span className="absolute right-full mr-3 bg-white text-black px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Ver Carrinho R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
            </button>
        </div>
      )}

      {/* Cart Drawer (Side Panel) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer Content */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right transform">
                {/* Header */}
                <div className="bg-gray-900 text-white p-6 flex items-center justify-between shadow-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div>
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <Icons.ShoppingBag className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Seu Pedido</h2>
                            <p className="text-xs text-gray-400">{cartCount} itens adicionados</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <Icons.X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FAFB]">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="bg-gray-100 p-6 rounded-full mb-4">
                                <Icons.ShoppingBag className="w-12 h-12 text-gray-300" />
                            </div>
                            <p className="font-medium text-lg text-gray-600">Sua sacola está vazia</p>
                            <p className="text-sm mb-6">Adicione itens deliciosos do nosso cardápio!</p>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
                            >
                                Ver Cardápio
                            </button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 group hover:border-primary/30 transition-colors">
                                <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 text-sm leading-tight pr-2">{item.name}</h4>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Icons.Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-primary font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-100 text-gray-600">
                                                <Icons.Minus className="w-3 h-3" />
                                            </button>
                                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-black text-white rounded-md shadow-sm hover:bg-gray-800">
                                                <Icons.Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full mt-2 border-t border-gray-50 pt-2">
                                    <input 
                                        type="text" 
                                        placeholder="Alguma observação?" 
                                        className="text-xs w-full bg-transparent border-none p-0 focus:ring-0 text-gray-600 placeholder-gray-400"
                                        value={item.observation || ''}
                                        onChange={(e) => updateObservation(item.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Checkout Section */}
                {cart.length > 0 && (
                    <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                         <div className="space-y-4 mb-6">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icons.User className="w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input 
                                    type="text" 
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Seu Nome"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none text-sm transition-all"
                                />
                            </div>
                            
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <input 
                                    type="text" 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Endereço de Entrega"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none text-sm transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'pix', label: 'PIX', icon: '💠' },
                                    { id: 'card', label: 'Cartão', icon: '💳' },
                                    { id: 'cash', label: 'Dinheiro', icon: '💵' },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`py-2 px-1 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                                            paymentMethod === method.id 
                                            ? 'bg-black text-white border-black' 
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="text-base">{method.icon}</span>
                                        {method.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-4 border-t border-dashed border-gray-200 pt-4">
                            <span className="text-gray-500 font-medium text-sm">Total a pagar</span>
                            <span className="text-3xl font-display text-gray-900 leading-none">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        
                        <button 
                            onClick={handleFinishOrder}
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                        >
                            <Icons.WhatsApp className="w-6 h-6" />
                            <span className="tracking-wide">FINALIZAR PEDIDO NO ZAP</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
      
      <footer className="bg-black text-gray-500 py-12 mt-12 text-center text-sm border-t-8 border-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
        <div className="relative z-10">
            <div className="opacity-80 mb-6 transform scale-75 origin-center grayscale hover:grayscale-0 transition-all duration-500">
                <Logo />
            </div>
            <p className="font-medium">© 2024 King Burguer.</p>
            <p className="text-xs mt-2 opacity-50">Feito com 💛 e muito código.</p>
        </div>
      </footer>
    </div>
  );
};