import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'bordered';
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  variant = 'default',
  className = '',
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const variants = {
    default: 'bg-white border border-[#E2EDF9] shadow-sm',
    elevated: 'bg-white shadow-md border border-[#E2EDF9]',
    bordered: 'bg-white border-2 border-[#D6E8FF]'
  };

  return (
    <div
      className={`rounded-2xl transition-shadow duration-200 ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
