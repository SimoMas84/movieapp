/* ============================================================
   PERSON TYPE
   Used for directors and actors throughout the app.
   Most fields are optional as TMDB data may be incomplete.
   ============================================================ */

export type PersonRole = "director" | "actor";

export interface Person {
  id: number;
  name: string;
  role: PersonRole;
  bio?: string;
  birthYear?: number;
  nationality?: string;
  photo: string | null;
  knownFor?: string[];
}