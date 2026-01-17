import { Skeleton } from "@/components/ui/skeleton";

interface SectionSkeletonProps {
  variant?: "about" | "skills" | "projects" | "experience" | "certifications" | "contact" | "footer";
}

export const SectionSkeleton = ({ variant = "about" }: SectionSkeletonProps) => {
  if (variant === "footer") {
    return (
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "contact") {
    return (
      <section className="section-padding min-h-[50vh]">
        <div className="container mx-auto container-padding">
          <div className="max-w-2xl mx-auto">
            {/* Header skeleton */}
            <div className="text-center mb-12">
              <Skeleton className="h-4 w-24 mx-auto mb-4" />
              <Skeleton className="h-10 w-64 mx-auto" />
            </div>
            {/* Form skeleton */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-12 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "experience" || variant === "certifications") {
    return (
      <section className="section-padding min-h-screen">
        <div className="container mx-auto container-padding">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-4 w-28 mx-auto mb-4" />
            <Skeleton className="h-10 w-56 mx-auto" />
          </div>
          {/* Timeline skeleton */}
          <div className="max-w-3xl mx-auto space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-4 w-4 rounded-full flex-shrink-0 mt-2" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "projects") {
    return (
      <section className="section-padding min-h-screen">
        <div className="container mx-auto container-padding">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-4 w-20 mx-auto mb-4" />
            <Skeleton className="h-10 w-48 mx-auto" />
          </div>
          {/* Projects grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "skills") {
    return (
      <section className="section-padding min-h-screen">
        <div className="container mx-auto container-padding">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-4 w-16 mx-auto mb-4" />
            <Skeleton className="h-10 w-40 mx-auto" />
          </div>
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          {/* Skills cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-7 w-16 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: About section skeleton
  return (
    <section className="section-padding min-h-screen">
      <div className="container mx-auto container-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-16">
            <Skeleton className="h-4 w-20 mx-auto mb-4" />
            <Skeleton className="h-10 w-48 mx-auto" />
          </div>
          {/* Content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Avatar skeleton */}
            <Skeleton className="aspect-square rounded-2xl max-w-sm mx-auto w-full" />
            {/* Text skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="pt-4 space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
