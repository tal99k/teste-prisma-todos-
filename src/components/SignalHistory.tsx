
import React from 'react';
import { Signal } from '../types/types';
import CallIcon from './icons/CallIcon';
import PutIcon from './icons/PutIcon';

interface SignalHistoryProps {
  signals: Signal[];
}

const SignalHistory: React.FC<SignalHistoryProps> = ({ signals }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-fuchsia-500/30">
      <h3 className="text-lg font-semibold mb-4 text-fuchsia-300">Histórico de Sinais</h3>
      <div className="max-h-96 overflow-y-auto">
        {signals.length === 0 ? (
          <p className="text-gray-400 text-center py-10">O histórico de sinais aparecerá aqui.</p>
        ) : (
          <table className="w-full text-left table-auto">
            <thead className="sticky top-0 bg-gray-800 z-10">
              <tr className="border-b border-gray-700">
                <th className="p-3 text-sm font-semibold text-gray-400">Par de Moedas</th>
                <th className="p-3 text-sm font-semibold text-gray-400">Direção</th>
                <th className="p-3 text-sm font-semibold text-gray-400 text-center">Horário de Entrada</th>
                <th className="p-3 text-sm font-semibold text-gray-400 text-center">Tempo Gráfico</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal) => (
                <tr key={signal.id} className="border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors">
                  <td className="p-3 font-medium">{signal.pair}</td>
                  <td className="p-3">
                    <span className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-bold w-fit ${signal.direction === 'CALL' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {signal.direction === 'CALL' ? <CallIcon className="w-4 h-4" /> : <PutIcon className="w-4 h-4" />}
                      {signal.direction}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-center">{signal.entry_time}</td>
                  <td className="p-3 font-mono text-center">{signal.time_frame}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SignalHistory;
