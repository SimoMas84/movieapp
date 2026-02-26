"use client";

import Link from "next/link";
import { Play, User } from "lucide-react";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";

/* =============================================
   NAVBAR COMPONENT
   Fixed top navbar with logo, desktop nav,
   login button and mobile menu
   ============================================= */
export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      {/* Inner container */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-2xl text-accent font-light tracking-widest"
        >
          <Play size={18} className="text-accent" />
          Movie<span className="text-text-primary">App</span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          <NavDesktop />

          {/* Login button */}
          <Link
            href="/login"
            className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent border border-accent text-surface-1 hover:border-accent hover:scale-110 transition-all duration-300"
          >
            <User size={15} />
            Accedi
          </Link>
        </div>

        {/* Mobile — login + menu button */}
        <div className="flex md:hidden items-center gap-8">
          <Link
            href="/login"
            className="h-10 flex items-center gap-2 text-sm font-medium px-4 rounded-xl bg-accent border border-accent text-surface-1 hover:border-border-subtle hover:text-text-secondary transition-all duration-300"
          >
            <User size={15} />
            Accedi
          </Link>
          <NavMobile />
        </div>
      </div>
    </header>
  );
}
