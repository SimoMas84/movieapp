"use client";

import { usePathname } from "next/navigation";
import SplashScreen from "@/components/layout/SplashScreen";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import Toast from "@/components/ui/Toast";

/* ============================================================
   LAYOUT SHELL
   Client component that conditionally renders SplashScreen,
   Footer, CookieBanner and Toast based on current route.
   ToastProvider and UserListsProvider live in layout.tsx
   so they cover Navbar and SearchBar too.
   ============================================================ */

const AUTH_ROUTES = ["/login", "/register", "/auth"];

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <SplashScreen />
      <main className="relative z-10">{children}</main>
      <Footer />
      <CookieBanner />
      <Toast />
    </>
  );
}
