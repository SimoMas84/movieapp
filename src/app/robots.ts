import type { MetadataRoute } from "next";

/* ============================================================
   ROBOTS.TXT
   Allows all crawlers on public pages.
   Blocks auth, API and private user pages.
   ============================================================ */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/films", "/series", "/people", "/movie/", "/serie/", "/person/"],
        disallow: [
          "/api/",
          "/auth/",
          "/profile",
          "/favorites",
          "/watchlist",
          "/reset-password",
          "/forgot-password",
          "/confirm",
          "/email-confirmed",
          "/forgot-confirm",
        ],
      },
    ],
    sitemap: "https://www.movieapp.it/sitemap.xml",
  };
}