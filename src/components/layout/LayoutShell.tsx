"use client";

import { usePathname } from "next/navigation";
import SplashScreen from "@/components/layout/SplashScreen";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import { ToastProvider } from "@/context/ToastContext";
import Toast from "@/components/ui/Toast";

/* ============================================================
   LAYOUT SHELL
   Client component that conditionally renders SplashScreen,
   Footer and CookieBanner based on current route.
   Navbar is rendered separately in layout.tsx as a Server
   Component to allow Supabase session access via next/headers.
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
      <ToastProvider>
        <SplashScreen />
        <main className="relative z-10">{children}</main>
        <Footer />
        <CookieBanner />
        <Toast />
      </ToastProvider>
    </>
  );
}

// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "@/components/layout/Navbar";
// import SplashScreen from "@/components/layout/SplashScreen";
// import Footer from "@/components/layout/Footer";
// import CookieBanner from "@/components/layout/CookieBanner";

// /* ============================================================
//    LAYOUT SHELL
//    Conditionally renders Navbar, Footer, SplashScreen and
//    CookieBanner. Auth pages (login, register) are rendered
//    standalone without the main layout chrome.
//    ============================================================ */

// /* Routes that should NOT show navbar, footer and splash */
// const AUTH_ROUTES = ["/login", "/register", "/auth"];

// interface LayoutShellProps {
//   children: React.ReactNode;
// }

// export default function LayoutShell({ children }: LayoutShellProps) {
//   const pathname = usePathname();

//   const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

//   if (isAuthPage) {
//     return <>{children}</>;
//   }

//   return (
//     <>
//       <SplashScreen />
//       <Navbar />
//       <main className="relative z-10">{children}</main>
//       <Footer />
//       <CookieBanner />
//     </>
//   );
// }
