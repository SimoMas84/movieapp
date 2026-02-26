"use client";

import { motion } from "motion/react";

/* =============================================
   PROPS INTERFACE
   ============================================= */
interface NavButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/* =============================================
   NAV BUTTON COMPONENT
   Animated hamburger → X icon
   ============================================= */
export default function NavButton({ isOpen, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative h-10 w-10 flex flex-col justify-center items-center cursor-pointer bg-transparent border-none"
      aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
    >
      {/* Top line */}
      <motion.span
        className="absolute block w-10 h-[0.5px] bg-accent rounded-full"
        animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -16 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Middle line */}
      <motion.span
        className="absolute block w-10 h-[0.5px] bg-accent rounded-full"
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />

      {/* Bottom line */}
      <motion.span
        className="absolute block w-10 h-[0.5px] bg-accent rounded-full"
        animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 16 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      />
    </button>
  );
}
