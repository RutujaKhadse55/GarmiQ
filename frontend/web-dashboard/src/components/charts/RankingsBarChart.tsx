import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { RiskRankingItem } from '../../types';

interface RankingsBarChartProps {
  rankings: RiskRankingItem[];
  className?: string;
  onSelectWard?: (wardId: string) => void;
}

export const RankingsBarChart: React.FC<RankingsBarChartProps> = ({
  rankings,
  className = '',
  onSelectWard,
}) => {
  const top10 = rankings.slice(0, 8);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl border border-[#DFEAF7] shadow-modal text-xs font-sans">
          <div className="font-bold text-[#102442] mb-1">
            Rank #{data.rank}: {data.ward_name}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4 text-red-600 font-semibold">
              <span>HVI Vulnerability Score:</span>
              <span>{data.vulnerability_score}/100</span>
            </div>
            <div className="flex justify-between gap-4 text-slate-600">
              <span>Heat Index:</span>
              <span>{data.heat_index}°C</span>
            </div>
            <div className="flex justify-between gap-4 text-slate-600">
              <span>Tree Canopy:</span>
              <span>{data.tree_canopy_pct}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft ${className}`}>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-[#102442]">Top Vulnerable Wards Comparison</h3>
        <p className="text-xs text-[#7186A3]">Composite Heat Vulnerability Index (HVI Score)</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top10} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="ward_name"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={45}
              tick={{ fill: '#7186A3', fontSize: 10 }}
            />
            <YAxis domain={[0, 100]} tick={{ fill: '#7186A3', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="vulnerability_score"
              radius={[4, 4, 0, 0]}
              onClick={(entry: any) => onSelectWard && onSelectWard(entry.ward_id)}
              className="cursor-pointer"
            >
              {top10.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.vulnerability_score >= 80
                      ? '#EF4444'
                      : entry.vulnerability_score >= 65
                      ? '#F97316'
                      : entry.vulnerability_score >= 50
                      ? '#F59E0B'
                      : '#10B981'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
