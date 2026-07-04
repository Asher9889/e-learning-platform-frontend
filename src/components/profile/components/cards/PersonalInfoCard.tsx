import { User } from "lucide-react";


import { SectionCard } from "../shared/SectionCard";
import { InfoRow } from "../shared/InfoRow";
import type { Profile } from "@/pages/Profile/types/profile.types";
import { formatDate } from "@/utils/profile.utils";

interface Props {
  profile: Profile;
}

export function PersonalInfoCard({
  profile,
}: Props) {
  return (
    <SectionCard title="Personal Information" icon={User} accent="blue">
      <InfoRow
        label="Full Name"
        value={profile.personalInfo.name}
      />

      <InfoRow
        label="Gender"
        value={profile.personalInfo.gender}
      />

      <InfoRow
        label="Date of Birth"
        value={formatDate(profile.personalInfo.dateOfBirth)}
      />
    </SectionCard>
  );
}