/* ============================================================
   FOOTER COMPONENT
   ============================================================ */

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-bg-primary md:px-10 py-8">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Logo + TMDB credits + Privacy */}
        <div className="flex items-center justify-center md:justify-start gap-3">
          <span className="text-text-muted text-xs">
            Dati e immagini forniti da
          </span>
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity duration-300 flex items-center"
          >
            <Image
              src="/tmdb.svg"
              alt="The Movie Database"
              width={80}
              height={16}
            />
          </a>
          <span className="text-text-muted">·</span>
          <Link
            href="/privacy"
            className="text-text-muted text-xs hover:text-text-secondary transition-colors duration-300"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Copyright + Author */}
        <div className="flex items-center justify-center md:justify-end gap-3">
          <p className="text-text-muted text-xs">© {year} MovieApp</p>
          <span className="text-text-muted text-xs">·</span>
          <a
            href="https://www.simonemassaccesi.it"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted text-xs hover:text-text-secondary transition-colors duration-300"
          >
            Simone Massaccesi
          </a>
        </div>
      </div>
    </footer>
  );
}
