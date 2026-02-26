import Link from "next/link";
import { Home, Heart, Bookmark, Video, Users } from "lucide-react";

/* =============================================
   NAVIGATION LINKS DATA
   ============================================= */
const navLinks = [
  { title: "Home", href: "/", icon: Home },
  { title: "Preferiti", href: "/favorites", icon: Heart },
  { title: "Watchlist", href: "/watchlist", icon: Bookmark },
  { title: "Registi", href: "/directors", icon: Video },
  { title: "Attori", href: "/actors", icon: Users },
];

/* =============================================
   NAV DESKTOP COMPONENT
   Horizontal links always visible on desktop
   ============================================= */
export default function NavDesktop() {
  return (
    <nav className="flex items-center gap-8">
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors duration-300"
          >
            <Icon size={15} />
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
}
