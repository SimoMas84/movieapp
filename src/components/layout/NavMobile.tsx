"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Bookmark, Users, Film, Tv } from "lucide-react";
import NavButton from "./NavButton";
import { menuContainer, navLinkVariants } from "@/lib/animations";

/* =============================================
   NAVIGATION LINKS DATA
   ============================================= */
const navLinks = [
  { title: "Home", href: "/", icon: Home },
  { title: "Film", href: "/films", icon: Film },
  { title: "Serie", href: "/series", icon: Tv },
  { title: "Registi/Attori", href: "/people", icon: Users },
  { title: "Watchlist", href: "/watchlist", icon: Bookmark },
  { title: "Preferiti", href: "/favorites", icon: Heart },
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
   Expanding menu for mobile.
   Both backdrop and menu rendered via portal.
   Scroll is locked when menu is open.
   ============================================= */
export default function NavMobile() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  /* ── Handlers ── */
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  /* ── Mount check for portal ── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Block scroll when menu is open ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ── Backdrop + Menu via portal — outside navbar stacking context ── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 z-[100]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeMenu}
                />

                {/* Menu container */}
                <motion.div
                  className="fixed bg-accent rounded-2xl overflow-hidden z-[102]"
                  style={{
                    top: "50svh",
                    left: "50%",
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                  variants={menuContainer}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <div className="flex flex-col justify-center h-full px-10">
                    <div className="flex flex-col gap-3 mx-auto">
                      {navLinks.map((link, i) => {
                        const Icon = link.icon;
                        const isActive =
                          link.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(link.href);
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
                                className={`flex items-center gap-3 text-2xl font-light transition-opacity duration-300 py-1 ${
                                  isActive
                                    ? "text-bg-primary opacity-100 font-medium"
                                    : "text-bg-primary hover:opacity-60"
                                }`}
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
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* ── Menu button — above everything ── */}
      <div className="relative z-[103]">
        <NavButton isOpen={isOpen} onClick={toggleMenu} />
      </div>
    </>
  );
}
