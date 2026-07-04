import { HeroSkeleton } from "./HeroSkeleton";
import { CardSkeleton } from "./CardSkeleton";

export function ProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6">

      <HeroSkeleton />

      <div className="grid gap-6 lg:grid-cols-2">

        <CardSkeleton />

        <CardSkeleton />

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <CardSkeleton />

        <CardSkeleton />

      </div>

    </div>
  );
}