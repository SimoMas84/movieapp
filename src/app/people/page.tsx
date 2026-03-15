/* ============================================================
   PEOPLE PAGE — Server Component
   Displays popular actors and directors fetched from TMDB.
   ============================================================ */

import { Users } from "lucide-react";
import { getPopularActors, getPopularDirectors } from "@/lib/tmdb";
import PersonCard from "@/components/cards/PersonCard";

export const metadata = {
  title: "Registi/Attori",
};

export default async function PeoplePage() {
  const [actors, directors] = await Promise.all([
    getPopularActors(),
    getPopularDirectors(),
  ]);

  const people = [...actors, ...directors];

  return (
    <div className="px-6 md:px-10 pb-16 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-end gap-4 mb-12 pt-32">
        <Users size={52} className="text-green-400 mb-1" />
        <h1 className="text-4xl lg:text-5xl font-light text-text-primary">
          Registi e Attori
        </h1>
      </div>
      <p className="text-2xl font-light text-text-primary mb-10">Popolari</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {people.map((person) => (
          <PersonCard
            key={person.id}
            id={person.id}
            name={person.name}
            department={
              person.known_for_department === "Acting" ? "Attore" : "Regista"
            }
            profilePath={person.profile_path}
          />
        ))}
      </div>
    </div>
  );
}
