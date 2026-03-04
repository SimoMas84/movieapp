/* =============================================
   MOVIEAPP — GENRE CONSTANTS
   ============================================= */

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export const genres: Genre[] = [
  { id: 1, name: "Azione", slug: "action" },
  { id: 2, name: "Avventura", slug: "adventure" },
  { id: 3, name: "Fantascienza", slug: "sci-fi" },
  { id: 4, name: "Drammatico", slug: "drama" },
  { id: 5, name: "Horror", slug: "horror" },
  { id: 6, name: "Commedia", slug: "comedy" },
  { id: 7, name: "Thriller", slug: "thriller" },
  { id: 8, name: "Romantico", slug: "romance" },
  { id: 9, name: "Animazione", slug: "animation" },
  { id: 10, name: "Documentario", slug: "documentary" },
  { id: 11, name: "Biografia", slug: "biography" },
  { id: 12, name: "Musical", slug: "musical" },
];