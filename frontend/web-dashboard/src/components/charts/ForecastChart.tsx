import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceArea,
} from 'recharts';
import { HourlyForecast } from '../../types';

interface ForecastChartProps {
  hourly: HourlyForecast[];
  className?: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ hourly, className = '' }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPeak = label === '12:00' || label === '14:00' || label === '16:00';
      return (
        <div className="bg-white p-3 rounded-xl border border-[#DFEAF7] shadow-modal text-xs font-sans">
          <div className="font-bold text-[#102442] mb-1">{label} hrs</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-red-600 font-bold">
              <span>Heat Index:</span>
              <span>{payload.find((p: any) => p.dataKey === 'heat_index_celsius')?.value}°C</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-700 font-semibold">
              <span>Air Temp:</span>
              <span>{payload.find((p: any) => p.dataKey === 'temp_celsius')?.value}°C</span>
            </div>
            <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-4 text-[10px]">
              <span>Outdoor Safety:</span>
              <span className={`font-bold ${isPeak ? 'text-red-600' : 'text-emerald-600'}`}>
                {isPeak ? 'Avoid Exposure' : 'Permissible'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-[#102442]">Diurnal Temperature & Heat Index Curve</h3>
          <p className="text-xs text-[#7186A3]">Observed morning trends & predicted peak afternoon thermal stress</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
            Peak Stress: 12:00 - 16:30
          </span>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourly} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="time" tick={{ fill: '#7186A3', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
            <YAxis domain={[22, 48]} tick={{ fill: '#7186A3', fontSize: 11 }} tickLine={false} axisLine={false} unit="°C" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <ReferenceArea x1="12:00" x2="16:00" fill="#EF4444" fillOpacity={0.08} label={{ value: 'Peak Danger Zone', fill: '#DC2626', fontSize: 10, position: 'top' }} />
            <Line
              type="monotone"
              dataKey="heat_index_celsius"
              name="Heat Index (°C)"
              stroke="#DC2626"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#DC2626', strokeWidth: 1, stroke: '#FFFFFF' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="temp_celsius"
              name="Air Temp (°C)"
              stroke="#0866D9"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#0866D9' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
