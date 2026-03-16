"use client";

/* ============================================================
   NAV MOBILE COMPONENT
   Expanding full-screen menu for mobile.
   Backdrop and menu rendered via portal to avoid stacking issues.
   Scroll is locked while menu is open.
   ============================================================ */

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Bookmark, Users, Film, Tv } from "lucide-react";
import NavButton from "./NavButton";
import { menuContainer, navLinkVariants } from "@/lib/animations";

/* ── Navigation links configuration ── */
const NAV_LINKS = [
  { title: "Home", href: "/", icon: Home },
  { title: "Film", href: "/films", icon: Film },
  { title: "Serie", href: "/series", icon: Tv },
  { title: "Registi/Attori", href: "/people", icon: Users },
  { title: "Watchlist", href: "/watchlist", icon: Bookmark },
  { title: "Preferiti", href: "/favorites", icon: Heart },
];

/* ── Perspective style for link animation ── */
const PERSPECTIVE_STYLE = {
  perspective: "120px",
  perspectiveOrigin: "bottom",
} as const;

export default function NavMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  /* ── Mount check for portal ── */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Lock scroll when menu is open ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
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
                      {NAV_LINKS.map(({ href, title, icon: Icon }, i) => {
                        const isActive =
                          href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(href);
                        return (
                          <div key={href} style={PERSPECTIVE_STYLE}>
                            <motion.div
                              custom={i}
                              variants={navLinkVariants}
                              initial="initial"
                              animate="enter"
                              exit="exit"
                            >
                              <Link
                                href={href}
                                onClick={closeMenu}
                                className={`flex items-center gap-3 text-2xl font-light transition-opacity duration-300 py-1 ${
                                  isActive
                                    ? "text-bg-primary opacity-100 font-medium"
                                    : "text-bg-primary hover:opacity-60"
                                }`}
                              >
                                <Icon size={20} className="text-bg-primary" />
                                {title}
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

      {/* Menu button — above everything */}
      <div className="relative z-[103]">
        <NavButton isOpen={isOpen} onClick={toggleMenu} />
      </div>
    </>
  );
}
