import React, { useState } from 'react';
import { AuthService } from '../services/auth';
import { Icons } from '../components/Icons';
import { Logo } from '../components/Logo';

interface LoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (AuthService.login(email, password)) {
      onLoginSuccess();
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 border-b-8 border-primary">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-gray-800"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-400 hover:text-black transition-colors"
        >
          <span className="flex items-center text-sm gap-1">← Voltar</span>
        </button>

        <div className="text-center mb-8 pt-6">
          <div className="mb-6 transform scale-90">
             <Logo large />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Área Administrativa</h2>
          <p className="text-gray-500 text-sm mt-1">Gerencie produtos e categorias</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100 flex items-center justify-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Icons.User className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="admin@admin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Senha</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Icons.Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-yellow-400 text-black font-extrabold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-yellow-200 transform hover:-translate-y-0.5 mt-2"
          >
            ENTRAR NO PAINEL
          </button>
        </form>
      </div>
    </div>
  );
};