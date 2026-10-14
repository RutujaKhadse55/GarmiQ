import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  return (
    <button {...props} style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
      {children}
    </button>
  );
};
