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
      bg: 'bg-[#EBFBF3] text-[#1E7E4D] border-[#B7EDCE]',
      icon: ShieldCheck,
      color: '#36B878',
      label: t('risk.VERY_LOW', 'Very Low Risk')
    },
    LOW: {
      bg: 'bg-[#EBFBF3] text-[#1E7E4D] border-[#B7EDCE]',
      icon: ShieldCheck,
      color: '#36B878',
      label: t('risk.LOW', 'Low Risk')
    },
    MODERATE: {
      bg: 'bg-[#FEF9EE] text-[#9A6B0A] border-[#FCE3AA]',
      icon: AlertCircle,
      color: '#F3B43F',
      label: t('risk.MODERATE', 'Moderate Risk')
    },
    HIGH: {
      bg: 'bg-[#FEF3ED] text-[#9E4010] border-[#FCD2BE]',
      icon: AlertTriangle,
      color: '#F47738',
      label: t('risk.HIGH', 'High Risk')
    },
    VERY_HIGH: {
      bg: 'bg-[#FDF0F1] text-[#A81F26] border-[#F9C3C6]',
      icon: Flame,
      color: '#E5484D',
      label: t('risk.VERY_HIGH', 'Very High Risk')
    },
    EXTREME: {
      bg: 'bg-[#FDF0F1] text-[#A81F26] border-[#E5484D] font-bold',
      icon: Flame,
      color: '#E5484D',
      label: t('risk.EXTREME', 'Extreme Heatwave')
    }
  }[level] || {
    bg: 'bg-[#FEF9EE] text-[#9A6B0A] border-[#FCE3AA]',
    icon: AlertCircle,
    color: '#F3B43F',
    label: level
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-bold'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs ${config.bg} ${sizeClasses}`}
    >
      {showIcon && <IconComponent className={iconSizes} style={{ color: config.color }} />}
      <span>{config.label}</span>
    </span>
  );
};
