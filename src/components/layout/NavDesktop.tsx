"use client";

/* ============================================================
   NAV DESKTOP COMPONENT
   Horizontal navigation links with active state highlight.
   ============================================================ */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Bookmark, Users, Film, Tv } from "lucide-react";

/* ── Navigation links configuration ── */
const NAV_LINKS = [
  { title: "Home", href: "/", icon: Home },
  { title: "Film", href: "/films", icon: Film },
  { title: "Serie", href: "/series", icon: Tv },
  { title: "Registi/Attori", href: "/people", icon: Users },
  { title: "Watchlist", href: "/watchlist", icon: Bookmark },
  { title: "Preferiti", href: "/favorites", icon: Heart },
];

export default function NavDesktop() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6">
      {NAV_LINKS.map(({ href, title, icon: Icon }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
              isActive ? "text-accent" : "text-text-secondary hover:text-accent"
            }`}
          >
            <Icon size={15} />
            {title}
          </Link>
        );
      })}
    </nav>
  );
}
