import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trendText?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'warning';
  icon: LucideIcon;
  variant?: 'danger' | 'warning' | 'success' | 'primary' | 'neutral';
  onClick?: () => void;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trendText,
  trendType = 'neutral',
  icon: Icon,
  variant = 'neutral',
  onClick,
  className = '',
}) => {
  const variantStyles = {
    danger: {
      border: 'border-red-100 hover:border-red-300',
      iconBg: 'bg-red-50 text-red-600',
      badge: 'bg-red-50 text-red-700',
      glow: 'hover:shadow-[0_4px_16px_rgba(239,68,68,0.1)]',
    },
    warning: {
      border: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
      badge: 'bg-amber-50 text-amber-700',
      glow: 'hover:shadow-[0_4px_16px_rgba(245,158,11,0.1)]',
    },
    success: {
      border: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600',
      badge: 'bg-emerald-50 text-emerald-700',
      glow: 'hover:shadow-[0_4px_16px_rgba(16,185,129,0.1)]',
    },
    primary: {
      border: 'border-blue-100 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-[#0866D9]',
      badge: 'bg-blue-50 text-[#0866D9]',
      glow: 'hover:shadow-[0_4px_16px_rgba(8,102,217,0.1)]',
    },
    neutral: {
      border: 'border-[#DFEAF7] hover:border-[#B8D3F2]',
      iconBg: 'bg-slate-50 text-slate-600',
      badge: 'bg-slate-50 text-slate-700',
      glow: 'hover:shadow-card',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-card border ${style.border} p-5 shadow-soft transition-all duration-200 ${style.glow} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7186A3]">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-3xl font-extrabold text-[#102442] tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-[#7186A3] mt-1">{subtitle}</p>}
      </div>

      {trendText && (
        <div className="mt-4 pt-3 border-t border-[#DFEAF7] flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold px-2 py-0.5 rounded ${
              trendType === 'warning'
                ? 'bg-amber-50 text-amber-700'
                : trendType === 'negative'
                ? 'bg-red-50 text-red-700'
                : trendType === 'positive'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-50 text-slate-600'
            }`}
          >
            {trendText}
          </span>
          <span className="text-[#7186A3] text-[11px]">vs last period</span>
        </div>
      )}
    </div>
  );
};
