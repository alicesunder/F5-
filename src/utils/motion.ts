/**
 * FO5 DIGITAL COMMAND CENTER — CENTRALIZED MOTION & INTERACTION SYSTEM
 * Fast, smooth, precise, controlled animations using cubic-bezier(0.22, 1, 0.36, 1).
 */

import { type Transition, type Variants } from 'motion/react';

// Central Motion Tokens
export const MOTION_TOKENS = {
  duration: {
    fast: 0.18, // 180ms
    normal: 0.28, // 280ms
    emphasis: 0.45, // 450ms
    cinematic: 0.6, // 600ms
  },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  spring: {
    tactile: { type: 'spring' as const, stiffness: 400, damping: 28 },
    smooth: { type: 'spring' as const, stiffness: 300, damping: 30 },
    snappy: { type: 'spring' as const, stiffness: 450, damping: 32 },
  },
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Global Page & Module Transitions (Requirement 1, 5, 25, 28)
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.985,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: MOTION_TOKENS.duration.emphasis,
      ease: MOTION_TOKENS.ease,
    },
    transitionEnd: { filter: 'none' },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    filter: 'blur(4px)',
    transition: {
      duration: 0.16,
      ease: MOTION_TOKENS.ease,
    },
  },
};

// Staggered Container for Dashboard KPI & Grid Items (Requirement 2, 24)
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

// Staggered Child Item
export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TOKENS.duration.normal,
      ease: MOTION_TOKENS.ease,
    },
  },
};

// Hero Entrance Sequence (Requirement 8)
export const heroSequenceVariants = {
  container: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: MOTION_TOKENS.duration.emphasis,
        ease: MOTION_TOKENS.ease,
      },
    },
  },
};

// Interactive Card Micro-interactions (Requirement 6, 26, 27)
export const cardHoverVariants = {
  hover: {
    y: -3,
    scale: 1.01,
    transition: {
      duration: MOTION_TOKENS.duration.fast,
      ease: MOTION_TOKENS.ease,
    },
  },
  tap: {
    scale: 0.985,
    transition: {
      duration: 0.12,
    },
  },
};

// Button Press Feedback (Requirement 10, 27)
export const buttonTapProps = {
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.15, ease: MOTION_TOKENS.ease },
  },
  whileTap: {
    scale: 0.975,
    transition: { duration: 0.1 },
  },
};

// Modal & Overlay Transitions (Requirement 13)
export const modalVariants = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
  },
  panel: {
    initial: { opacity: 0, scale: 0.96, y: 10 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.25, ease: MOTION_TOKENS.ease },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      y: 8,
      transition: { duration: 0.18, ease: MOTION_TOKENS.ease },
    },
  },
};

// Department Colors for smooth contextual transition (Requirement 4)
export const DEPARTMENT_ACCENTS = {
  all: {
    color: '#25202B',
    light: '#F7F7F9',
    glow: 'rgba(37, 32, 43, 0.08)',
  },
  admin: {
    color: '#5B2A86',
    light: '#EDE4F7',
    glow: 'rgba(91, 42, 134, 0.15)',
  },
  relations: {
    color: '#2583D8',
    light: '#EAF3FD',
    glow: 'rgba(37, 131, 216, 0.15)',
  },
  disaster: {
    color: '#E89B22',
    light: '#FEF5E9',
    glow: 'rgba(232, 155, 34, 0.15)',
  },
  volunteer: {
    color: '#42A77A',
    light: '#EAF7F0',
    glow: 'rgba(66, 167, 122, 0.15)',
  },
} as const;
