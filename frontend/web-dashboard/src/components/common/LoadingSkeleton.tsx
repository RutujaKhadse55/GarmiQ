import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
  variant?: 'table' | 'card' | 'map' | 'chart';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 4,
  className = '',
  variant = 'card',
}) => {
  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-card border border-[#DFEAF7] p-5 animate-pulse ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-8 bg-slate-200 rounded w-1/2 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`bg-white rounded-card border border-[#DFEAF7] p-6 animate-pulse ${className}`}>
        <div className="h-5 bg-slate-200 rounded w-1/4 mb-4" />
        <div className="h-56 bg-slate-100 rounded-lg flex items-end justify-between p-4 gap-3">
          {[60, 80, 45, 90, 75, 85, 95].map((h, i) => (
            <div key={i} className="bg-slate-200 rounded-t w-full" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'map') {
    return (
      <div className={`bg-slate-100 rounded-card border border-[#DFEAF7] animate-pulse flex flex-col items-center justify-center p-8 min-h-[360px] ${className}`}>
        <div className="w-12 h-12 rounded-full border-4 border-[#0866D9] border-t-transparent animate-spin mb-3" />
        <div className="h-4 bg-slate-200 rounded w-48 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-32" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-card border border-[#DFEAF7] p-4 divide-y divide-slate-100 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="py-3 flex items-center justify-between animate-pulse">
          <div className="space-y-2 w-1/3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
          <div className="h-6 bg-slate-200 rounded w-20" />
          <div className="h-4 bg-slate-100 rounded w-16" />
        </div>
      ))}
    </div>
  );
};
