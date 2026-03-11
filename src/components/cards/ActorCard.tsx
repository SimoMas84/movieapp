"use client";

import Image from "next/image";
import { tmdbImage } from "@/lib/tmdb";
import { useRouter } from "next/navigation";

interface ActorCardProps {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  index: number;
}

export default function ActorCard({
  id,
  name,
  character,
  profilePath,
  index,
}: ActorCardProps) {
  const router = useRouter();
  return (
    <div
      className="relative flex-shrink-0 w-32 md:w-40 cursor-pointer"
      onClick={() => router.push(`/person/${id}`)}
    >
      {/* ── Portrait ── */}
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-surface-2 border border-transparent hover:border-accent transition-all duration-300">
        {profilePath ? (
          <Image
            src={tmdbImage.profile(profilePath) ?? ""}
            alt={name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 128px, 160px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
            <span className="text-text-muted text-xs text-center px-2">
              {name}
            </span>
          </div>
        )}

        {/* ── Bottom overlay ── */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-primary/90 to-transparent p-2 pt-8">
          <p className="text-text-primary text-xs font-medium leading-tight truncate">
            {name}
          </p>
          <p className="text-text-muted text-xs truncate mt-0.5">{character}</p>
        </div>
      </div>
    </div>
  );
}
