import { Candle } from '../types/types';

/**
 * Parses CSV text into an array of Candle objects.
 * Assumes CSV format: timestamp,open,high,low,close
 * @param csvText The raw CSV string.
 * @returns An array of Candle objects.
 */
export const parseCandleData = (csvText: string): Candle[] => {
  if (!csvText) {
    return [];
  }

  const lines = csvText.trim().split('\n');
  const header = lines.shift(); // remove header

  if (!header) {
      return [];
  }

  return lines
    .map(line => {
      const values = line.split(',');
      if (values.length < 5) {
        return null; // Skip malformed lines
      }
      const [time, open, high, low, close] = values;
      return {
        time: parseInt(time, 10),
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
      };
    })
    .filter((candle): candle is Candle => candle !== null)
    .sort((a, b) => a.time - b.time); // Sort by time ascending
};
