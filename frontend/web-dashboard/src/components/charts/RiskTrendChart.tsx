import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { MOCK_RISK_TRENDS } from '../../mocks/fixtures';

export const RiskTrendChart: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [metric, setMetric] = useState<'counts' | 'temperatures'>('counts');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl border border-[#DFEAF7] shadow-modal text-xs font-sans">
          <div className="font-bold text-[#102442] mb-1.5 pb-1 border-b border-slate-100">
            {label}
          </div>
          {metric === 'counts' ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4 text-red-600 font-semibold">
                <span>High / Extreme Wards:</span>
                <span>{payload.find((p: any) => p.dataKey === 'high')?.value}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-amber-600 font-semibold">
                <span>Moderate Risk:</span>
                <span>{payload.find((p: any) => p.dataKey === 'moderate')?.value}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-emerald-600 font-semibold">
                <span>Low Risk:</span>
                <span>{payload.find((p: any) => p.dataKey === 'low')?.value}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4 text-[#102442] font-semibold">
                <span>Avg Air Temp:</span>
                <span>{payload.find((p: any) => p.dataKey === 'avgTemp')?.value}°C</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-red-600 font-semibold">
                <span>Peak Heat Index:</span>
                <span>{payload.find((p: any) => p.dataKey === 'peakHeatIndex')?.value}°C</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#102442]">Citywide Heat-Risk Trend</h3>
          <p className="text-xs text-[#7186A3]">Observed history (10-15 Jun) & forecast horizon (16-18 Jun)</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-[#DFEAF7]">
          <button
            onClick={() => setMetric('counts')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              metric === 'counts' ? 'bg-[#0866D9] text-white shadow-sm' : 'text-[#7186A3] hover:text-[#102442]'
            }`}
          >
            Ward Counts
          </button>
          <button
            onClick={() => setMetric('temperatures')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              metric === 'temperatures' ? 'bg-[#0866D9] text-white shadow-sm' : 'text-[#7186A3] hover:text-[#102442]'
            }`}
          >
            Thermal Index
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'counts' ? (
            <AreaChart data={MOCK_RISK_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMod" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fill: '#7186A3', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis tick={{ fill: '#7186A3', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="high" name="High / Very High Wards" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorHigh)" />
              <Area type="monotone" dataKey="moderate" name="Moderate Risk Wards" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorMod)" />
              <Area type="monotone" dataKey="low" name="Low Risk Wards" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorLow)" />
            </AreaChart>
          ) : (
            <AreaChart data={MOCK_RISK_TRENDS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHeatIndex" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0866D9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0866D9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fill: '#7186A3', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis domain={[34, 48]} tick={{ fill: '#7186A3', fontSize: 11 }} tickLine={false} axisLine={false} unit="°C" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="peakHeatIndex" name="Peak Heat Index (°C)" stroke="#DC2626" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHeatIndex)" />
              <Area type="monotone" dataKey="avgTemp" name="Avg Air Temp (°C)" stroke="#0866D9" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
