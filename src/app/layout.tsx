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
  title: "MovieApp - Database Cinema",
  description: "Database di cinema, film e serie TV",
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
