import React, { useState, useCallback } from 'react';
import { Broker, TimeFrame, Signal, AnalysisResult, Candle } from '../types/types';
import { TIME_FRAMES, CURRENCY_PAIRS } from '../constants/constants';
import { generateSignal } from '../services/geminiService';
import SignalHistory from './SignalHistory';
import CandlestickChart from './CandlestickChart';

interface DashboardProps {
  broker: Broker;
  onLogout: () => void;
}

type AccountType = 'DEMO' | 'REAL';

const Dashboard: React.FC<DashboardProps> = ({ broker, onLogout }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('5M');
  const [selectedPair, setSelectedPair] = useState<string>(CURRENCY_PAIRS[0]);
  const [accountType, setAccountType] = useState<AccountType>('DEMO');
  const [balance, setBalance] = useState(10000);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candleData, setCandleData] = useState<Candle[]>([]);

  const handleGenerateSignal = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const result: AnalysisResult = await generateSignal(selectedPair, selectedTimeFrame);
      const newSignal: Signal = {
        id: new Date().toISOString(),
        pair: result.pair,
        direction: result.direction,
        time_frame: result.time_frame,
        entry_time: result.entry_time,
      };
      setSignals(prev => [newSignal, ...prev].slice(0, 10)); // Keep last 10 signals
      setAnalysis(result.analysis);
    } catch (err) {
      setError('Falha ao gerar sinal. A IA pode estar sobrecarregada. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPair, selectedTimeFrame]);

  const toggleAccountType = () => {
    if (accountType === 'DEMO') {
      setAccountType('REAL');
      setBalance(Math.floor(Math.random() * 5000) + 500);
    } else {
      setAccountType('DEMO');
      setBalance(10000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center bg-gray-800 p-4 rounded-lg border border-fuchsia-500/30">
        <div className="flex items-center space-x-4">
          <img src={broker.logoUrl} alt={broker.name} className="h-12 w-12 object-contain" />
          <div>
            <h2 className="text-xl font-bold">Conectado a {broker.name}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Saldo ({accountType}):</span>
                <span className="font-mono text-lg text-green-400">${balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button onClick={toggleAccountType} className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition">Trocar Conta</button>
            <button onClick={onLogout} className="px-3 py-1 text-sm bg-red-600 hover:bg-red-500 rounded-md transition">Desconectar</button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-6 rounded-lg border border-fuchsia-500/30">
        <h3 className="text-lg font-semibold mb-4 text-fuchsia-300">Configuração de Sinais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Par de Moedas</label>
            <select value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
              {CURRENCY_PAIRS.map(pair => <option key={pair} value={pair}>{pair}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tempo Gráfico</label>
            <div className="flex space-x-2">
              {TIME_FRAMES.map(tf => (
                <button key={tf} onClick={() => setSelectedTimeFrame(tf)} className={`w-full py-2 text-sm font-bold rounded-md transition ${selectedTimeFrame === tf ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/30' : 'bg-gray-700 hover:bg-gray-600'}`}>
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="md:self-end">
            <button onClick={handleGenerateSignal} disabled={isLoading} className="w-full py-2 px-4 bg-fuchsia-600 text-white font-bold rounded-md hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-opacity-75 transition-all duration-300 shadow-lg shadow-fuchsia-600/30 disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed">
              {isLoading ? 'Analisando...' : 'Gerar Sinal'}
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 p-6 rounded-lg border border-fuchsia-500/30">
          <h3 className="text-lg font-semibold mb-4 text-fuchsia-300">Gráfico de Mercado - {selectedPair}</h3>
          <CandlestickChart data={candleData} />
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <SignalHistory signals={signals} />
        </div>
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-fuchsia-500/30">
          <h3 className="text-lg font-semibold mb-4 text-fuchsia-300">Análise da IA</h3>
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-400"></div>
              </div>
            )}
            {error && <div className="p-4 bg-red-500/20 text-red-300 rounded-md">{error}</div>}
            {analysis && !isLoading && (
              <div className="text-gray-300 prose prose-invert prose-p:my-2">
                <p>{analysis}</p>
              </div>
            )}
            {!analysis && !isLoading && !error && (
                 <div className="text-gray-400 text-center py-10">
                    <p>A análise da IA aparecerá aqui após a geração de um sinal.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
