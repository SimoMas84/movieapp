/* =============================================
   MOVIEAPP — ANIMATION VARIANTS
   Centralized framer-motion variants for
   consistent animations across the app
   ============================================= */

import { Variants } from 'motion/react';

export const menuContainer: Variants = {
  open: {
    width: '320px',
    height: '500px',
    opacity: 1,
    transition: {
      duration: 0.75,
      type: 'tween',
      ease: [0.76, 0, 0.24, 1],
    },
  },
  closed: {
    width: '0px',
    height: '0px',
    opacity: 0,
    transition: {
      duration: 0.75,
      delay: 0.35,
      type: 'tween',
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

/* =============================================
   NAVBAR — NAV LINKS
   Perspective rotation effect on entry/exit
   ============================================= */
export const navLinkVariants: Variants = {
  initial: {
    opacity: 0,
    rotateX: 90,
    translateY: 80,
    translateX: -20,
  },
  enter: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    translateY: 0,
    translateX: 0,
    transition: {
      duration: 0.65,
      delay: 0.3 + i * 0.1,
      ease: [0.215, 0.61, 0.355, 1],
      opacity: { duration: 0.35 },
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      type: 'tween',
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

export const buttonSlider = {
  open: {
    top: '-100%' as string,
    transition: { duration: 0.5, type: 'tween' as const, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    top: '0%' as string,
    transition: { duration: 0.5, type: 'tween' as const, ease: [0.76, 0, 0.24, 1] },
  },
} as const;