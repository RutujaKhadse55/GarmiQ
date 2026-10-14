import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-44 bg-[#E2EDF9] rounded-3xl" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-20 bg-[#E2EDF9] rounded-2xl" />
        <div className="h-20 bg-[#E2EDF9] rounded-2xl" />
        <div className="h-20 bg-[#E2EDF9] rounded-2xl" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-24 bg-[#E2EDF9] rounded-2xl" />
      ))}
    </div>
  );
};
