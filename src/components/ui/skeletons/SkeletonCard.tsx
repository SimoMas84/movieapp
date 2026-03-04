/* =============================================
   SKELETON CARD COMPONENT
   Animated placeholder for movie cards
   while data is loading
   ============================================= */
export default function SkeletonCard() {
  return (
    <div className="relative flex-shrink-0 w-36 md:w-44 animate-pulse">
      {/* Poster placeholder */}
      <div className="relative w-full aspect-[2/3] rounded-xl bg-surface-2" />
      {/* Rating placeholder */}
      <div className="absolute top-2 left-2 w-10 h-5 rounded-md bg-surface-2" />
    </div>
  );
}
