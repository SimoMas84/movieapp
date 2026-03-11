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

  return (
    <div className="pt-28 px-6 md:px-10 pb-16 max-w-screen-2xl mx-auto space-y-16">
      {/* ── Attori ── */}
      <section>
        <h1 className="text-3xl md:text-5xl font-light text-text-primary mb-10">
          Attori
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {actors.map((actor) => (
            <PersonCard
              key={actor.id}
              id={actor.id}
              name={actor.name}
              department="Attore"
              profilePath={actor.profile_path}
            />
          ))}
        </div>
      </section>

      {/* ── Registi ── */}
      <section>
        <h2 className="text-3xl md:text-5xl font-light text-text-primary mb-10">
          Registi
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {directors.map((director) => (
            <PersonCard
              key={director.id}
              id={director.id}
              name={director.name}
              department="Regista"
              profilePath={director.profile_path}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
