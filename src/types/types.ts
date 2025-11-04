export interface Broker {
  id: string;
  name: string;
  logoUrl: string;
}

export type TimeFrame = '1M' | '5M' | '15M';

export interface Signal {
  id: string;
  pair: string;
  direction: 'CALL' | 'PUT';
  time_frame: TimeFrame;
  entry_time: string;
}

export interface Candle {
  time: number; // unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface AnalysisResult {
  analysis: string;
  pair: string;
  direction: 'CALL' | 'PUT';
  time_frame: TimeFrame;
  entry_time: string;
}