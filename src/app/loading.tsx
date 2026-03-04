import SkeletonGallery from "@/components/ui/skeletons/SkeletonGallery";

export default function Loading() {
  return (
    <div className="pt-24">
      <div className="w-full h-[60vh] bg-surface-2 animate-pulse mb-8" />
      <SkeletonGallery />
      <SkeletonGallery />
      <SkeletonGallery />
    </div>
  );
}
