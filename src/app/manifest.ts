import type { MetadataRoute } from "next";

/* ============================================================
   PWA MANIFEST
   ============================================================ */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "MovieApp",
    short_name:       "MovieApp",
    description:      "Scopri film e serie",
    start_url:        "/",
    display:          "standalone",
    orientation:      "portrait",
    background_color: "#0d1520",
    theme_color:      "#0d1520",
    icons: [
  {
    src:     "/web-app-manifest-192x192.png",
    sizes:   "192x192",
    type:    "image/png",
    purpose: "any",
  },
  {
    src:     "/web-app-manifest-192x192.png",
    sizes:   "192x192",
    type:    "image/png",
    purpose: "maskable",
  },
  {
    src:     "/web-app-manifest-512x512.png",
    sizes:   "512x512",
    type:    "image/png",
    purpose: "any",
  },
  {
    src:     "/web-app-manifest-512x512.png",
    sizes:   "512x512",
    type:    "image/png",
    purpose: "maskable",
  },
],
  };
}