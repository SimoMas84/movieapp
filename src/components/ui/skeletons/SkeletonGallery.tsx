import SkeletonCard from "./SkeletonCard";

/* =============================================
   SKELETON GALLERY COMPONENT
   Animated placeholder for movie galleries
   while data is loading
   ============================================= */
export default function SkeletonGallery() {
  return (
    <div className="px-6 md:px-10 py-6">
      {/* Title placeholder */}
      <div className="h-6 w-40 rounded-md bg-surface-2 animate-pulse mb-6" />
      {/* Cards row */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
