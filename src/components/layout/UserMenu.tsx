"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "motion/react";
import Link from "next/link";
import { User, UserCircle, LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";

/* ============================================================
   USER MENU COMPONENT
   Accent dropdown that appears below the account button.
   Same animation style as NavMobile menu.
   Used on both mobile and desktop.
   ============================================================ */

interface UserMenuProps {
  firstName: string;
  isMobile?: boolean;
}

const perspectiveStyle = {
  perspective: "120px",
  perspectiveOrigin: "bottom",
} as const;

/* ── Menu items animation — same as navLinkVariants ── */
const itemVariants: Variants = {
  initial: { opacity: 0, rotateX: 90, y: -8 },
  enter: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: 0.35, delay: 0.05 + i * 0.07, ease: "easeOut" },
  }),
  exit: (i: number) => ({
    opacity: 0,
    rotateX: 90,
    y: -8,
    transition: { duration: 0.2, delay: i * 0.04, ease: "easeIn" },
  }),
};

/* ── Dropdown container animation ── */
const dropdownVariants: Variants = {
  closed: { opacity: 0, scale: 0.85, y: -8 },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
};

export default function UserMenu({
  firstName,
  isMobile = false,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = useCallback(() => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 28,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  /* ── Close on route change ── */
  useEffect(() => {
    if (isOpen) closeMenu();
  }, []);

  const menuItems = [{ label: "Profilo", href: "/profile", icon: UserCircle }];

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        aria-label="Menu account"
        className={
          isMobile
            ? "h-10 w-10 flex items-center justify-center rounded-xl bg-accent hover:bg-accent-hover transition-all duration-300 cursor-pointer"
            : "h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent hover:bg-accent-hover text-bg-primary transition-all duration-300 cursor-pointer"
        }
      >
        <User size={isMobile ? 16 : 15} className="text-bg-primary" />
        {!isMobile && <span className="text-bg-primary">{firstName}</span>}
      </button>

      {/* ── Dropdown via portal ── */}
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

                {/* Dropdown */}
                <motion.div
                  className="fixed z-[102] bg-accent rounded-2xl overflow-hidden shadow-2xl min-w-44"
                  style={{ top: dropdownPos.top, right: dropdownPos.right }}
                  variants={dropdownVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <div className="flex flex-col px-6 py-5 gap-1">
                    {menuItems.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.href} style={perspectiveStyle}>
                          <motion.div
                            custom={i}
                            variants={itemVariants}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                          >
                            <Link
                              href={item.href}
                              onClick={closeMenu}
                              className="flex items-center gap-3 text-lg font-light text-bg-primary hover:opacity-60 transition-opacity duration-200 py-1"
                            >
                              <Icon size={18} className="text-bg-primary" />
                              {item.label}
                            </Link>
                          </motion.div>
                        </div>
                      );
                    })}

                    {/* Divider */}
                    <div className="border-t border-bg-primary/20 my-2" />

                    {/* Logout */}
                    <div style={perspectiveStyle}>
                      <motion.div
                        custom={menuItems.length}
                        variants={itemVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                      >
                        <form action={logout}>
                          <button
                            type="submit"
                            className="flex items-center gap-3 text-lg font-light text-bg-primary hover:opacity-60 transition-opacity duration-200 py-1 cursor-pointer w-full"
                          >
                            <LogOut size={18} className="text-bg-primary" />
                            Esci
                          </button>
                        </form>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
