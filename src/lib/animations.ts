/* ============================================================
   ANIMATION VARIANTS
   Centralized Framer Motion variants for consistent
   animations across the app.
   ============================================================ */

import { Variants } from "motion/react";

/* ── Mobile menu container — expands from 0×0 to full size ── */
export const menuContainer: Variants = {
  open: {
    width: "320px",
    height: "500px",
    opacity: 1,
    transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    width: "0px",
    height: "0px",
    opacity: 0,
    transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1] },
  },
};

/* ── Nav links — perspective rotation on entry/exit ── */
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
    transition: { duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1] },
  },
};

/* ── Hamburger button slider ── */
export const buttonSlider = {
  open: {
    top: "-100%" as string,
    transition: { duration: 0.5, type: "tween" as const, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    top: "0%" as string,
    transition: { duration: 0.5, type: "tween" as const, ease: [0.76, 0, 0.24, 1] },
  },
} as const;

/* ── Hamburger lines ── */
export const hamburgerTop = (isOpen: boolean) => ({
  rotate: isOpen ? 45 : 0,
  y: isOpen ? 0 : -16,
  transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const },
});

export const hamburgerMiddle = (isOpen: boolean) => ({
  opacity: isOpen ? 0 : 1,
  scaleX: isOpen ? 0 : 1,
  transition: { duration: 0.2, ease: "easeInOut" as const },
});

export const hamburgerBottom = (isOpen: boolean) => ({
  rotate: isOpen ? -45 : 0,
  y: isOpen ? 0 : 16,
  transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const },
});

/* ── Modal backdrop — fade in/out ── */
export const modalBackdrop: Variants = {
  hidden:  { opacity: 0, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } },
  visible: { opacity: 1, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } },
};

/* ── Modal panel — scale from 0 ── */
export const modalPanel: Variants = {
  hidden:  { scale: 0, opacity: 0, transition: { duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1] } },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1] } },
};

/* ── Modal wrapper — fade in/out ── */
export const modalWrapper: Variants = {
  hidden:  { opacity: 0, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } },
  visible: { opacity: 1, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } },
};

/* ── Movie card — fade in + slide up on viewport enter ── */
export const cardEntry: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.215, 0.61, 0.355, 1] },
  }),
};

/* ── Genre filter card — animate reorder on filter change ── */
export const filterCard: Variants = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.215, 0.61, 0.355, 1] } },
  exit:    { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

/* ── Search dropdown ── */
export const searchDropdown: Variants = {
  hidden:  { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] } },
  visible: { opacity: 1, y:  0, transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] } },
};

/* ── Search panel — drops below navbar ── */
export const searchPanel: Variants = {
  hidden:  { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } },
  visible: { opacity: 1, y:   0, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } },
};