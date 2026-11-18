import React from 'react';

interface BppSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const BppSkeleton: React.FC<BppSkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'lg',
}) => {
  const roundedClass = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={`bpp-skeleton ${roundedClass} ${className}`}
      style={{
        width: width || undefined,
        height: height || undefined,
      }}
      aria-hidden="true"
    />
  );
};

export const BppCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`liquid-glass-card rounded-2xl p-5 space-y-3.5 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <BppSkeleton width="36px" height="36px" rounded="xl" />
        <div className="space-y-1.5">
          <BppSkeleton width="120px" height="14px" rounded="md" />
          <BppSkeleton width="80px" height="10px" rounded="sm" />
        </div>
      </div>
      <BppSkeleton width="48px" height="20px" rounded="full" />
    </div>
    <BppSkeleton width="100%" height="32px" rounded="md" />
    <div className="flex items-center justify-between pt-2">
      <BppSkeleton width="90px" height="12px" rounded="sm" />
      <BppSkeleton width="60px" height="12px" rounded="sm" />
    </div>
  </div>
);
