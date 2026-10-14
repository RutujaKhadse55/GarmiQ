import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeatRiskLevel } from '@garmiq/types';
import { ShieldCheck, AlertCircle, AlertTriangle, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: HeatRiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true
}) => {
  const { t } = useTranslation();

  const config = {
    VERY_LOW: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: ShieldCheck,
      color: '#10B981',
      label: t('risk.VERY_LOW', 'Very Low')
    },
    LOW: {
      bg: 'bg-lime-50 text-lime-800 border-lime-200',
      icon: ShieldCheck,
      color: '#84CC16',
      label: t('risk.LOW', 'Low Risk')
    },
    MODERATE: {
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: AlertCircle,
      color: '#F59E0B',
      label: t('risk.MODERATE', 'Moderate Risk')
    },
    HIGH: {
      bg: 'bg-orange-50 text-orange-800 border-orange-300',
      icon: AlertTriangle,
      color: '#F97316',
      label: t('risk.HIGH', 'High Risk')
    },
    VERY_HIGH: {
      bg: 'bg-red-50 text-red-800 border-red-300',
      icon: Flame,
      color: '#EF4444',
      label: t('risk.VERY_HIGH', 'Very High Risk')
    },
    EXTREME: {
      bg: 'bg-rose-100 text-rose-900 border-rose-400 font-bold',
      icon: Flame,
      color: '#DC2626',
      label: t('risk.EXTREME', 'Extreme Heatwave')
    }
  }[level] || {
    bg: 'bg-amber-50 text-amber-800 border-amber-300',
    icon: AlertCircle,
    color: '#F59E0B',
    label: level
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm font-semibold'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} shadow-sm select-none`}
    >
      {showIcon && <IconComponent className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
