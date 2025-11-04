
import React from 'react';
import { Broker } from '../types';

interface BrokerSelectorProps {
  brokers: Broker[];
  onSelect: (broker: Broker) => void;
}

const BrokerSelector: React.FC<BrokerSelectorProps> = ({ brokers, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-6 text-purple-300">Selecione sua Corretora</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl">
        {brokers.map((broker) => (
          <button
            key={broker.id}
            onClick={() => onSelect(broker)}
            className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          >
            <img src={broker.logoUrl} alt={broker.name} className="h-16 w-16 mb-4 object-contain" />
            <span className="text-lg font-medium">{broker.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrokerSelector;
