import { ShieldCheck } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { InfoRow } from "../shared/InfoRow";
import { StatusPill } from "../shared/StatusPill";
import type { Profile } from "@/pages/Profile/types/profile.types";
import { formatDate } from "@/utils/profile.utils";
import { ROLE_LABEL } from "@/pages/Profile/constants/profile.constants";

interface Props {
  profile: Profile;
}

export function AccountCard({ profile }: Props) {
  return (
    <SectionCard title="Account Information" icon={ShieldCheck} accent="slate">
      <InfoRow label="Role" value={ROLE_LABEL[profile.role]} />
      <InfoRow label="Status">
        <StatusPill status={profile.status} />
      </InfoRow>
      <InfoRow label="Email" value={profile.email} />
      <InfoRow label="Phone Number" value={profile.phoneNumber} />
      <InfoRow label="Member Since" value={formatDate(profile.createdAt)} />
      <InfoRow label="Last Updated" value={formatDate(profile.updatedAt)} />
    </SectionCard>
  );
}