import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

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
  title: "MovieApp — Scopri il Cinema",
  description: "La tua piattaforma di scoperta cinematografica.",
};

/* =============================================
   ROOT LAYOUT
   ============================================= */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={rubik.className}>
      <body className="antialiased">
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// import { Rubik } from "next/font/google";
// import "./globals.css";

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
//   title: "MovieApp — Scopri il Cinema",
//   description:
//     "La tua piattaforma di scoperta cinematografica. Film, registi, attori e trailer in un'unica app.",
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
//       <body className="antialiased">{children}</body>
//     </html>
//   );
// }
