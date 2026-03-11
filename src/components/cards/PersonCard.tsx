"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { tmdbImage } from "@/lib/tmdb";

interface PersonCardProps {
  id: number;
  name: string;
  department: string;
  profilePath: string | null;
}

export default function PersonCard({
  id,
  name,
  department,
  profilePath,
}: PersonCardProps) {
  const router = useRouter();

  return (
    <div
      className="cursor-pointer group"
      onClick={() => router.push(`/person/${id}`)}
    >
      {/* ── Portrait ── */}
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-surface-2 border border-transparent group-hover:border-accent transition-all duration-300">
        {profilePath ? (
          <Image
            src={tmdbImage.poster(profilePath) ?? ""}
            alt={name}
            fill
            className="object-cover object-top group-hover:brightness-110 transition-all duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
            <span className="text-text-muted text-xs text-center px-2">
              {name}
            </span>
          </div>
        )}

        {/* ── Bottom overlay ── */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-primary/90 to-transparent p-3 pt-10">
          <p className="text-accent text-xs truncate mb-0.5">{department}</p>
          <p className="text-text-primary text-sm font-medium leading-tight truncate">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}
