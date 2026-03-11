"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Bookmark, Users, Film, Tv } from "lucide-react";

const navLinks = [
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
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
              isActive ? "text-accent" : "text-text-secondary hover:text-accent"
            }`}
          >
            <Icon size={15} />
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
}
