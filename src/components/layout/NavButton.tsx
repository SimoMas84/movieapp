"use client";

/* ============================================================
   NAV BUTTON COMPONENT
   Animated hamburger → X icon.
   Always rendered above backdrop and menu.
   ============================================================ */

import { motion } from "motion/react";
import {
  hamburgerTop,
  hamburgerMiddle,
  hamburgerBottom,
} from "@/lib/animations";

interface NavButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function NavButton({ isOpen, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
      className="relative h-10 w-10 flex flex-col justify-center items-center cursor-pointer bg-transparent border-none"
    >
      {/* Top line */}
      <motion.span
        className="absolute block w-10 h-[0.5px] bg-accent rounded-sm"
        animate={hamburgerTop(isOpen)}
      />
      {/* Middle line */}
      <motion.span
        className="absolute block w-10 h-[0.5px] bg-accent rounded-sm"
        animate={hamburgerMiddle(isOpen)}
      />
      {/* Bottom line */}
      <motion.span
        className="absolute block w-10 h-[0.5px] bg-accent rounded-sm"
        animate={hamburgerBottom(isOpen)}
      />
    </button>
  );
}
