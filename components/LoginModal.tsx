
import React, { useState } from 'react';
import { Broker } from '../types';

interface LoginModalProps {
  broker: Broker;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ broker, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    // Simulate API call
    setTimeout(() => {
      setIsConnecting(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-fuchsia-500/50 transform transition-all"
           style={{boxShadow: '0 0 25px rgba(168, 85, 247, 0.5)'}}>
        <div className="flex flex-col items-center mb-6">
          <img src={broker.logoUrl} alt={broker.name} className="h-20 w-20 mb-4 object-contain"/>
          <h2 className="text-2xl font-bold text-fuchsia-300">Conectar a {broker.name}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-white"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-white"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isConnecting}
              className="px-6 py-2 bg-fuchsia-600 text-white font-bold rounded-md hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-opacity-75 transition-all duration-300 shadow-lg shadow-fuchsia-600/30 disabled:bg-gray-500 disabled:shadow-none"
            >
              {isConnecting ? 'Conectando...' : 'Conectar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
