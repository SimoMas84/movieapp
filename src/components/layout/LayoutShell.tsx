"use client";

import { usePathname } from "next/navigation";
import SplashScreen from "@/components/layout/SplashScreen";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import { ToastProvider } from "@/context/ToastContext";
import { UserListsProvider } from "@/context/UserListsContext";
import Toast from "@/components/ui/Toast";

/* ============================================================
   LAYOUT SHELL
   Client component that conditionally renders SplashScreen,
   Footer and CookieBanner based on current route.
   Navbar is rendered separately in layout.tsx as a Server
   Component to allow Supabase session access via next/headers.
   UserListsProvider wraps the app so favorites and watchlist
   state is shared globally across all cards and pages.
   ToastProvider must be the outer wrapper since UserListsContext
   uses toast notifications internally.
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
    <ToastProvider>
      <UserListsProvider>
        <SplashScreen />
        <main className="relative z-10">{children}</main>
        <Footer />
        <CookieBanner />
        <Toast />
      </UserListsProvider>
    </ToastProvider>
  );
}

// "use client";

// import { usePathname } from "next/navigation";
// import SplashScreen from "@/components/layout/SplashScreen";
// import Footer from "@/components/layout/Footer";
// import CookieBanner from "@/components/layout/CookieBanner";
// import { ToastProvider } from "@/context/ToastContext";
// import Toast from "@/components/ui/Toast";

// /* ============================================================
//    LAYOUT SHELL
//    Client component that conditionally renders SplashScreen,
//    Footer and CookieBanner based on current route.
//    Navbar is rendered separately in layout.tsx as a Server
//    Component to allow Supabase session access via next/headers.
//    ============================================================ */

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
//       <ToastProvider>
//         <SplashScreen />
//         <main className="relative z-10">{children}</main>
//         <Footer />
//         <CookieBanner />
//         <Toast />
//       </ToastProvider>
//     </>
//   );
// }
