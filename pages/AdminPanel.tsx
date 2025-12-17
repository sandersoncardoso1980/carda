import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { AuthService } from '../services/auth';
import { Category, Product } from '../types';
import { Icons } from '../components/Icons';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form States
  const [productForm, setProductForm] = useState<Partial<Product>>({ isAvailable: true });
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({});

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setCategories(StorageService.getCategories());
    setProducts(StorageService.getProducts());
  };

  const handleLogout = () => {
    AuthService.logout();
    onLogout();
  };

  // --- CRUD Handlers ---

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: productForm.name || '',
      description: productForm.description || '',
      price: Number(productForm.price) || 0,
      image: productForm.image || 'https://picsum.photos/400/300',
      categoryId: productForm.categoryId || categories[0]?.id || '',
      isAvailable: productForm.isAvailable ?? true,
    };
    StorageService.saveProduct(newProduct);
    refreshData();
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({ isAvailable: true });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      StorageService.deleteProduct(id);
      refreshData();
    }
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm(product);
    } else {
      setEditingProduct(null);
      setProductForm({ isAvailable: true, categoryId: categories[0]?.id });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory: Category = {
      id: editingCategory ? editingCategory.id : Date.now().toString(),
      name: categoryForm.name || '',
      slug: (categoryForm.name || '').toLowerCase().replace(/\s+/g, '-'),
    };
    StorageService.saveCategory(newCategory);
    refreshData();
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({});
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar produtos vinculados.')) {
      StorageService.deleteCategory(id);
      refreshData();
    }
  };

  const openCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm(category);
    } else {
      setEditingCategory(null);
      setCategoryForm({});
    }
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-secondary text-white shadow-md border-b-4 border-primary">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-primary p-2 rounded-lg text-black">
                <Icons.Lock className="w-5 h-5" />
             </div>
             <div>
               <h1 className="text-xl font-bold">Painel Administrativo</h1>
               <p className="text-xs text-gray-400">BurgerHub Manager</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors border border-gray-700"
          >
            <Icons.LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-primary text-black shadow-md border-2 border-black' : 'bg-white text-gray-500 hover:bg-gray-100 border-2 border-transparent'}`}
          >
            Produtos ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'categories' ? 'bg-primary text-black shadow-md border-2 border-black' : 'bg-white text-gray-500 hover:bg-gray-100 border-2 border-transparent'}`}
          >
            Categorias ({categories.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[500px]">
          {activeTab === 'products' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h2>
                <button 
                  onClick={() => openProductModal()}
                  className="bg-primary hover:bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-bold shadow-sm"
                >
                  <Icons.Plus className="w-5 h-5" /> Novo Produto
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-100 text-sm">
                      <th className="py-3 px-2">Produto</th>
                      <th className="py-3 px-2">Categoria</th>
                      <th className="py-3 px-2">Preço</th>
                      <th className="py-3 px-2 text-center">Status</th>
                      <th className="py-3 px-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 group">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-200 border border-gray-100" />
                            <div>
                              <div className="font-bold text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-gray-600 text-sm font-medium">
                          {categories.find(c => c.id === product.categoryId)?.name || 'Sem Categoria'}
                        </td>
                        <td className="py-4 px-2 font-bold text-gray-900">
                          R$ {product.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.isAvailable ? 'ATIVO' : 'INATIVO'}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openProductModal(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Icons.Edit className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Icons.Trash className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciar Categorias</h2>
                <button 
                  onClick={() => openCategoryModal()}
                  className="bg-primary hover:bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-bold shadow-sm"
                >
                  <Icons.Plus className="w-5 h-5" /> Nova Categoria
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(category => (
                  <div key={category.id} className="bg-white border border-gray-200 p-5 rounded-xl flex justify-between items-center hover:shadow-md transition-shadow">
                    <span className="font-bold text-lg text-gray-800">{category.name}</span>
                    <div className="flex gap-2">
                       <button 
                          onClick={() => openCategoryModal(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Icons.Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Icons.Trash className="w-5 h-5" />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-bold text-gray-900 font-display">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 rounded-full hover:bg-red-50">
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSaveProduct} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Nome do Produto</label>
                  <input
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white text-gray-900 placeholder-gray-400 transition-all shadow-sm"
                    value={productForm.name || ''}
                    onChange={e => setProductForm({...productForm, name: e.target.value})}
                    placeholder="Ex: X-Burguer Especial"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Descrição</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white text-gray-900 placeholder-gray-400 transition-all shadow-sm resize-none"
                    value={productForm.description || ''}
                    onChange={e => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Descreva os ingredientes..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Preço (R$)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white text-gray-900 placeholder-gray-400 transition-all shadow-sm"
                      value={productForm.price || ''}
                      onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Categoria</label>
                    <div className="relative">
                        <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white text-gray-900 transition-all shadow-sm appearance-none cursor-pointer"
                        value={productForm.categoryId || ''}
                        onChange={e => setProductForm({...productForm, categoryId: e.target.value})}
                        >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">URL da Imagem</label>
                  <input
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white text-gray-900 placeholder-gray-400 transition-all shadow-sm"
                    value={productForm.image || ''}
                    onChange={e => setProductForm({...productForm, image: e.target.value})}
                    placeholder="https://..."
                  />
                  {productForm.image && (
                      <div className="mt-2 h-24 w-full rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center">
                          <img src={productForm.image} alt="Preview" className="h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                  )}
                </div>
                <div 
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors select-none" 
                    onClick={() => setProductForm({...productForm, isAvailable: !productForm.isAvailable})}
                >
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-200 ${productForm.isAvailable ? 'bg-primary border-primary scale-110' : 'bg-white border-gray-300'}`}>
                    {productForm.isAvailable && <Icons.Check className="w-4 h-4 text-black" />}
                  </div>
                  <label className="text-gray-900 font-bold cursor-pointer">Produto disponível para venda</label>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-yellow-400 text-black font-extrabold py-4 rounded-xl mt-4 shadow-lg shadow-yellow-200/50 transform transition-all active:scale-95 text-lg">
                  {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-bold text-gray-900 font-display">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 rounded-full hover:bg-red-50">
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSaveCategory} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Nome da Categoria</label>
                  <input
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white text-gray-900 placeholder-gray-400 transition-all shadow-sm"
                    value={categoryForm.name || ''}
                    onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                    placeholder="Ex: Hambúrgueres"
                  />
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-yellow-400 text-black font-extrabold py-4 rounded-xl mt-4 shadow-lg shadow-yellow-200/50 transform transition-all active:scale-95 text-lg">
                  Salvar Categoria
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};