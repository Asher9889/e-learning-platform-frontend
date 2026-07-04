import { AlertCircle } from "lucide-react";
import { useProfile } from "./hooks";
import { SectionGrid } from "#components/profile/components/shared/SectionGrid";
import { PersonalInfoCard } from "#components/profile/components/cards/PersonalInfoCard";
import { RoleInfoCard } from "#components/profile/components/cards/RoleInfoCard";
import { AccountCard } from "#components/profile/components/cards/AccountCard";
import { ProfileHero } from "#components/profile/components/hero/ProfileHero";
import { ProfileSkeleton } from "#components/profile/components/skeleton/ProfileSkeleton";



export function ProfilePage() {
  const {
    data: profile,
    isPending,
    isError,
  } = useProfile();

  if (isPending) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="flex h-[100%] flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-destructive" />

        <h2 className="text-xl font-semibold">
          Unable to load profile
        </h2>

        <p className="text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">

      <ProfileHero profile={profile} />

      <SectionGrid>

        <PersonalInfoCard profile={profile} />

        <RoleInfoCard profile={profile} />
        <AccountCard profile={profile} />

      </SectionGrid>

     

    </div>
  );
}