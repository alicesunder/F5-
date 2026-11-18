import React from 'react';
import { motion } from 'motion/react';
import { MOTION_TOKENS, prefersReducedMotion } from '../../../utils/motion';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  className = '',
  delay = 0,
  yOffset = 16,
}) => {
  const isReduced = prefersReducedMotion();

  if (isReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: MOTION_TOKENS.duration.normal,
        delay,
        ease: MOTION_TOKENS.ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
