import { Broker, TimeFrame } from './types';

export const BROKERS: Broker[] = [
  { id: 'pocket_option', name: 'Pocket Option', logoUrl: 'https://cdn.worldvectorlogo.com/logos/pocket-option-1.svg' },
  { id: 'exnova', name: 'Exnova', logoUrl: 'https://exnova.net/images/logo.svg' },
  { id: 'iq_option', name: 'IQ Option', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/IQ_Option_Logo.svg' },
  { id: 'quotex', name: 'Quotex', logoUrl: 'https://quotex.io/img/logo-transparent.e31e51b6.svg' },
];

export const TIME_FRAMES: TimeFrame[] = ['1M', '5M', '15M'];

export const CURRENCY_PAIRS: string[] = [
  'EUR/USD', 'GBP/USD', 'AUD/USD', 'USD/JPY', 'USD/CHF', 'USD/CAD',
  'EUR/JPY', 'EUR/GBP', 'AUD/JPY', 'NZD/USD',
  'EUR/USD-OTC', 'GBP/USD-OTC', 'AUD/USD-OTC', 'USD/JPY-OTC',
  'EUR/JPY-OTC', 'NZD/USD-OTC',
];