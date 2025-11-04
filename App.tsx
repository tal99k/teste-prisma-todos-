
import React, { useState } from 'react';
import { Broker } from './types';
import { BROKERS } from './constants';
import BrokerSelector from './components/BrokerSelector';
import LoginModal from './components/LoginModal';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleBrokerSelect = (broker: Broker) => {
    setSelectedBroker(broker);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedBroker(null);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="p-4 text-center">
        <h1 className="text-4xl font-bold text-fuchsia-400 tracking-wider" style={{ textShadow: '0 0 10px #a855f7, 0 0 20px #a855f7' }}>
          PRISMA IA
        </h1>
      </header>
      <main className="container mx-auto p-4">
        {!isLoggedIn ? (
          <BrokerSelector brokers={BROKERS} onSelect={handleBrokerSelect} />
        ) : selectedBroker && (
          <Dashboard broker={selectedBroker} onLogout={handleLogout} />
        )}
        {showLoginModal && selectedBroker && (
          <LoginModal
            broker={selectedBroker}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </main>
    </div>
  );
};

export default App;
