import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ size = 'md' }: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizes[size]} border-gray-300 border-t-[var(--color-primary)] rounded-full animate-spin`} />
    </div>
  );
}
