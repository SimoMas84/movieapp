"use client";

/* =============================================
   TRAILER PLAYER COMPONENT
   Embedded YouTube player for movie detail page
   ============================================= */
interface TrailerPlayerProps {
  trailerKey: string;
  title: string;
}

export default function TrailerPlayer({
  trailerKey,
  title,
}: TrailerPlayerProps) {
  return (
    <section>
      <h2 className="text-xl font-light text-text-primary mb-6">Trailer</h2>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border-subtle">
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1`}
          title={`Trailer — ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </section>
  );
}
