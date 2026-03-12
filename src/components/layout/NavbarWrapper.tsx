"use client";

import { usePathname } from "next/navigation";

/* ============================================================
   NAVBAR WRAPPER
   Client component that hides the Navbar on auth pages.
   Navbar itself stays a Server Component to allow
   Supabase session access via next/headers.
   ============================================================ */

const AUTH_ROUTES = ["/login", "/register", "/auth"];

interface NavbarWrapperProps {
  children: React.ReactNode;
}

export default function NavbarWrapper({ children }: NavbarWrapperProps) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthPage) return null;

  return <>{children}</>;
}
