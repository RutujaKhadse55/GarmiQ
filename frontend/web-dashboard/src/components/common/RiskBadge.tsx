import React from 'react';
import { HeatRiskLevel } from '../../types';

interface RiskBadgeProps {
  level: HeatRiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const normalized = (level || '').toUpperCase();

  let bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dotColor = 'bg-emerald-500';
  let label = 'Low Risk';

  if (normalized === 'VERY_LOW' || normalized === 'LOW') {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
    label = 'Low Risk';
  } else if (normalized === 'MODERATE') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
    label = 'Moderate Risk';
  } else if (normalized === 'HIGH') {
    bg = 'bg-orange-50 text-orange-700 border-orange-200';
    dotColor = 'bg-orange-500';
    label = 'High Risk';
  } else if (normalized === 'VERY_HIGH' || normalized === 'EXTREME' || normalized === 'EXTREME_WARNING') {
    bg = 'bg-red-50 text-red-700 border-red-200';
    dotColor = 'bg-red-500';
    label = normalized === 'EXTREME' ? 'Extreme Risk' : 'Very High Risk';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bg} ${sizeClasses[size]} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {label}
    </span>
  );
};
