/* =============================================
   MOVIEAPP — PERSON TYPES
   ============================================= */

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