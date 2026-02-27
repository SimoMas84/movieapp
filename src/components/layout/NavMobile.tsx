"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Home, Heart, Bookmark, Video, Users, Film, Tv } from "lucide-react";
import NavButton from "./NavButton";
import { menuContainer, navLinkVariants } from "@/lib/animations";

/* =============================================
   NAVIGATION LINKS DATA
   ============================================= */
const navLinks = [
  { title: "Home", href: "/", icon: Home },
  { title: "Film", href: "/films", icon: Film },
  { title: "Serie TV", href: "/series", icon: Tv },
  { title: "Preferiti", href: "/favorites", icon: Heart },
  { title: "Watchlist", href: "/watchlist", icon: Bookmark },
  { title: "Registi", href: "/directors", icon: Video },
  { title: "Attori", href: "/actors", icon: Users },
];

/* =============================================
   CONSTANTS
   ============================================= */
const perspectiveStyle = {
  perspective: "120px",
  perspectiveOrigin: "bottom",
} as const;

/* =============================================
   NAV MOBILE COMPONENT
   Awwwards-style expanding menu for mobile
   ============================================= */
export default function NavMobile() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /* ── Handlers ── */
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  /* ── Block scroll when menu is open ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop — click outside to close */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Expanding menu container — centered in viewport */}
      <motion.div
        className="fixed bg-accent rounded-2xl overflow-hidden z-40"
        style={{
          top: "50svh",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={menuContainer}
        animate={isOpen ? "open" : "closed"}
        initial="closed"
      >
        <AnimatePresence>
          {isOpen && (
            <div className="flex flex-col justify-center h-full px-10">
              <div className="flex flex-col gap-3 mx-auto">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <div key={link.href} style={perspectiveStyle}>
                      <motion.div
                        custom={i}
                        variants={navLinkVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                      >
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          className="flex items-center gap-3 text-2xl font-light text-bg-primary hover:opacity-60 transition-opacity duration-300 py-1"
                        >
                          <Icon size={20} className="text-bg-primary" />
                          {link.title}
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Menu button */}
      <NavButton isOpen={isOpen} onClick={toggleMenu} />
    </>
  );
}
