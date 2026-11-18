import React from 'react';
import { motion } from 'motion/react';
import { pageVariants, prefersReducedMotion } from '../../../utils/motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const isReduced = prefersReducedMotion();

  if (isReduced) {
    return <div className={`w-full ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
