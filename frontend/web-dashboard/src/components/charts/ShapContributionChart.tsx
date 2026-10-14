import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { ShapFeature } from '../../types';
import { HelpCircle } from 'lucide-react';

interface ShapContributionChartProps {
  features: ShapFeature[];
  baseScore: number;
  finalScore: number;
  className?: string;
}

export const ShapContributionChart: React.FC<ShapContributionChartProps> = ({
  features,
  baseScore,
  finalScore,
  className = '',
}) => {
  const chartData = features.map((f) => ({
    name: f.display_name,
    shapValue: f.shap_value,
    featureValue: f.feature_value,
    direction: f.contribution_direction,
    description: f.description,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl border border-[#DFEAF7] shadow-modal max-w-xs text-xs font-sans">
          <div className="font-bold text-[#102442] mb-1">{data.name}</div>
          <div className="text-[11px] text-[#7186A3] mb-1.5">
            Measured Value: <span className="font-semibold text-[#102442]">{data.featureValue}</span>
          </div>
          <div
            className={`font-bold mb-1.5 ${
              data.shapValue > 0 ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            Model Contribution: {data.shapValue > 0 ? `+${data.shapValue}` : data.shapValue} pts
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-1.5">
            {data.description}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-[#102442]">SHAP Risk Drivers & Feature Attribution</h3>
            <span
              className="text-[#7186A3] hover:text-[#102442] cursor-help"
              title="SHAP (SHapley Additive exPlanations) isolates the contribution of each urban environmental parameter from the citywide baseline score."
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-[#7186A3] mt-0.5">
            Attribution delta from Pune city baseline ({baseScore} pts) to final risk ({finalScore} pts)
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-red-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            Increases Risk (+)
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            Protective Shading (-)
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" tick={{ fill: '#7186A3', fontSize: 10 }} unit=" pts" domain={[-15, 18]} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#132D50', fontSize: 11, fontWeight: 500 }}
              width={140}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#94A3B8" strokeWidth={1.5} />
            <Bar dataKey="shapValue" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.shapValue > 0 ? '#EF4444' : '#10B981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-[#7186A3] leading-relaxed">
        <span className="font-bold text-[#102442]">Note on Explainability:</span> Feature contributions represent statistical weights derived from Pune environmental regression models and do not assert sole causal determinism.
      </div>
    </div>
  );
};
