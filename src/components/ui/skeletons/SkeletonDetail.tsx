/* =============================================
   SKELETON DETAIL COMPONENT
   Animated placeholder for movie/serie
   detail pages while data is loading
   ============================================= */
export default function SkeletonDetail() {
  return (
    <div className="animate-pulse">
      {/* ── Hero skeleton ── */}
      <div className="relative w-full h-svh bg-surface-2">
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-16">
          <div className="max-w-screen-2xl mx-auto flex items-end gap-12">
            {/* Poster */}
            <div className="hidden lg:block shrink-0 w-64 aspect-[2/3] rounded-xl bg-surface-1" />

            {/* Info */}
            <div className="flex-1 max-w-3xl space-y-4">
              <div className="h-16 w-3/4 rounded-xl bg-surface-1" />
              <div className="h-5 w-48 rounded-md bg-surface-1" />
              <div className="h-5 w-32 rounded-md bg-surface-1" />
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-sm bg-surface-1" />
                <div className="h-6 w-20 rounded-sm bg-surface-1" />
                <div className="h-6 w-14 rounded-sm bg-surface-1" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded-md bg-surface-1" />
                <div className="h-4 w-5/6 rounded-md bg-surface-1" />
                <div className="h-4 w-4/6 rounded-md bg-surface-1" />
              </div>
              <div className="flex gap-3">
                <div className="h-11 w-11 rounded-xl bg-surface-1" />
                <div className="h-11 w-11 rounded-xl bg-surface-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content skeleton ── */}
      <div className="px-6 md:px-10 py-16 max-w-screen-2xl mx-auto space-y-16">
        {/* Trailer */}
        <div className="w-full aspect-video rounded-xl bg-surface-2" />

        {/* Cast */}
        <div className="space-y-6">
          <div className="h-6 w-24 rounded-md bg-surface-2" />
          <div className="flex gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-32 aspect-[2/3] rounded-xl bg-surface-2"
              />
            ))}
          </div>
        </div>

        {/* Box office */}
        <div className="space-y-4">
          <div className="h-6 w-32 rounded-md bg-surface-2" />
          <div className="flex gap-8">
            <div className="space-y-2">
              <div className="h-3 w-16 rounded-md bg-surface-2" />
              <div className="h-6 w-32 rounded-md bg-surface-2" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 rounded-md bg-surface-2" />
              <div className="h-6 w-32 rounded-md bg-surface-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
