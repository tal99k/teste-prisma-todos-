import { Broker, TimeFrame } from '../types/types';

export const BROKERS: Broker[] = [
  { id: 'pocket_option', name: 'Pocket Option', logoUrl: 'https://cdn.worldvectorlogo.com/logos/pocket-option-1.svg' },
  { id: 'exnova', name: 'Exnova', logoUrl: 'https://get-in.exnova.com/images/logo.svg' },
  { id: 'iq_option', name: 'IQ Option', logoUrl: 'https://iqoption.com/img/header/logo.svg' },
  { id: 'quotex', name: 'Quotex', logoUrl: 'https://quotex.io/favicon.svg' },
];

export const TIME_FRAMES: TimeFrame[] = ['1M', '5M', '15M'];

export const CURRENCY_PAIRS: string[] = [
  'EUR/USD', 'GBP/USD', 'AUD/USD', 'USD/JPY', 'USD/CHF', 'USD/CAD',
  'EUR/JPY', 'EUR/GBP', 'AUD/JPY', 'NZD/USD',
  'EUR/USD-OTC', 'GBP/USD-OTC', 'AUD/USD-OTC', 'USD/JPY-OTC',
  'EUR/JPY-OTC', 'NZD/USD-OTC',
];