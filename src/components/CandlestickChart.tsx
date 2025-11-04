
import React, { useEffect, useRef } from 'react';
import { Candle } from '../types/types';

interface CandlestickChartProps {
  data: Candle[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<{ chart: any; series: any; } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const LightweightCharts = (window as any).LightweightCharts;

    if (!LightweightCharts) {
        console.error('LightweightCharts library is not loaded.');
        return;
    }

    // Create chart and series only once
    if (!chartRef.current) {
        const chart = LightweightCharts.createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 300,
            layout: {
              background: { color: '#1f2937' }, // gray-800
              textColor: 'rgba(229, 231, 235, 0.8)',
            },
            grid: {
              vertLines: { color: '#374151' },
              horzLines: { color: '#374151' },
            },
            crosshair: {
              mode: LightweightCharts.CrosshairMode.Normal,
            },
            rightPriceScale: {
              borderColor: '#4b5563',
            },
            timeScale: {
              borderColor: '#4b5563',
              timeVisible: true,
              secondsVisible: false,
            },
        });
        const series = chart.addCandlestickSeries({
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderDownColor: '#ef4444',
            borderUpColor: '#22c55e',
            wickDownColor: '#ef4444',
            wickUpColor: '#22c55e',
        });
        chartRef.current = { chart, series };

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        // Cleanup function for when component really unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }
  }, []); // Empty dependency array ensures this runs only once

  // Separate effect to handle data updates
  useEffect(() => {
    if (chartRef.current && data) {
        chartRef.current.series.setData(data);
        if (data.length > 0) {
            chartRef.current.chart.timeScale().fitContent();
        }
    }
  }, [data]);

  return (
    <div ref={chartContainerRef} className="w-full h-[300px]">
        {data.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500">
                O gráfico do mercado aparecerá aqui.
            </div>
        )}
    </div>
  );
};

export default CandlestickChart;
