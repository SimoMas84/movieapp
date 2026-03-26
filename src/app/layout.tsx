import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import LayoutShell from "@/components/layout/LayoutShell";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import { ToastProvider } from "@/context/ToastContext";
import { UserListsProvider } from "@/context/UserListsContext";
import { Analytics } from "@vercel/analytics/next";

/* ── Font ── */
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

/* ── Viewport — separato da metadata come richiede Next.js 16 ── */
export const viewport: Viewport = {
  themeColor: "#070A10",
  width: "device-width",
  initialScale: 1,
};

/* ── Metadata ── */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.movieapp.it"),
  title: {
    default: "MovieApp - Scopri Film e Serie",
    template: "%s | MovieApp",
  },
  description:
    "Scopri film e serie TV, leggi trame, guarda trailer, esplora cast e trovale in streaming. Il tuo database cinematografico.",
  keywords: [
    "film",
    "serie tv",
    "cinema",
    "trailer",
    "cast",
    "streaming",
    "database film",
  ],
  authors: [{ name: "MovieApp" }],
  creator: "MovieApp",
  /* ── Canonical URL ── */
  alternates: {
    canonical: "https://www.movieapp.it",
  },
  /* ── PWA iOS meta tag ── */
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MovieApp",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://www.movieapp.it",
    siteName: "MovieApp",
    title: "MovieApp — Scopri Film e Serie TV",
    description:
      "Scopri film e serie TV, leggi trame, guarda trailer, esplora cast e trovale in streaming.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MovieApp — Scopri Film e Serie TV",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieApp — Scopri Film e Serie TV",
    description:
      "Scopri film e serie TV, leggi trame, guarda trailer, esplora cast e trovale in streaming.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

/* ── Root Layout ── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={rubik.className}>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
      </head>
      <body className="antialiased">
        <ToastProvider>
          <UserListsProvider>
            <NavbarWrapper>
              <Navbar />
            </NavbarWrapper>
            <LayoutShell>{children}</LayoutShell>
          </UserListsProvider>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
