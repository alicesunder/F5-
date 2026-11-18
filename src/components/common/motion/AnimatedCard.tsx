import React from 'react';
import { motion } from 'motion/react';
import { MOTION_TOKENS, prefersReducedMotion } from '../../../utils/motion';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isInteractive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  isInteractive = true,
  onClick,
  ...props
}) => {
  const isReduced = prefersReducedMotion();

  if (!isInteractive || isReduced) {
    return (
      <div
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileHover={{
        y: -3,
        scale: 1.01,
        transition: { duration: MOTION_TOKENS.duration.fast, ease: MOTION_TOKENS.ease },
      }}
      whileTap={{
        scale: 0.985,
        transition: { duration: 0.1 },
      }}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
