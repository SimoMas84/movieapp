import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import LayoutShell from "@/components/layout/LayoutShell";
import NavbarWrapper from "@/components/layout/NavbarWrapper";

/* =============================================
   FONT CONFIGURATION
   ============================================= */
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

/* =============================================
   APP METADATA
   ============================================= */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.movieapp.it"),
  title: {
    default: "MovieApp — Scopri Film e Serie TV",
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

/* =============================================
   ROOT LAYOUT
   ============================================= */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={rubik.className}>
      <body className="antialiased">
        <NavbarWrapper>
          <Navbar />
        </NavbarWrapper>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// import { Rubik } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/layout/Navbar";
// import SplashScreen from "@/components/layout/SplashScreen";
// import Footer from "@/components/layout/Footer";
// import CookieBanner from "@/components/layout/CookieBanner";
// import LayoutShell from "@/components/layout/LayoutShell";

// /* =============================================
//    FONT CONFIGURATION
//    ============================================= */
// const rubik = Rubik({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600"],
//   display: "swap",
// });

// /* =============================================
//    APP METADATA
//    ============================================= */
// export const metadata: Metadata = {
//   metadataBase: new URL("https://www.movieapp.it"),
//   title: {
//     default: "MovieApp — Scopri Film e Serie TV",
//     template: "%s | MovieApp",
//   },
//   description:
//     "Scopri film e serie TV, leggi trame, guarda trailer, esplora cast e trovale in streaming. Il tuo database cinematografico.",
//   keywords: [
//     "film",
//     "serie tv",
//     "cinema",
//     "trailer",
//     "cast",
//     "streaming",
//     "database film",
//   ],
//   authors: [{ name: "MovieApp" }],
//   creator: "MovieApp",
//   openGraph: {
//     type: "website",
//     locale: "it_IT",
//     url: "https://www.movieapp.it",
//     siteName: "MovieApp",
//     title: "MovieApp — Scopri Film e Serie TV",
//     description:
//       "Scopri film e serie TV, leggi trame, guarda trailer, esplora cast e trovale in streaming.",
//     images: [
//       {
//         url: "/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "MovieApp — Scopri Film e Serie TV",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "MovieApp — Scopri Film e Serie TV",
//     description:
//       "Scopri film e serie TV, leggi trame, guarda trailer, esplora cast e trovale in streaming.",
//     images: ["/og-image.png"],
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
// };

// /* =============================================
//    ROOT LAYOUT
//    ============================================= */
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="it" className={rubik.className}>
//       <body className="antialiased">
//         <LayoutShell>{children}</LayoutShell>
//       </body>
//     </html>
//   );
// }
