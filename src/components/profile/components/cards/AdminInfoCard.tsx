import { ShieldCheck } from "lucide-react";



import { SectionCard } from "../shared/SectionCard";
import { InfoRow } from "../shared/InfoRow";
import type { AdminRoleInfo } from "@/pages/Profile/types/profile.types";
import { formatDate } from "@/utils/profile.utils";

interface Props {
  roleInfo: AdminRoleInfo;
}

export function AdminInfoCard({
  roleInfo,
}: Props) {
  return (
    <SectionCard title="Administration" icon={ShieldCheck} accent="violet">
      <InfoRow
        label="Employee ID"
        value={roleInfo.employeeId}
      />

      <InfoRow
        label="Designation"
        value={roleInfo.designation}
      />

      <InfoRow
        label="Access Level"
        value={roleInfo.accessLevel}
      />

      <InfoRow
        label="Joining Date"
        value={formatDate(roleInfo.joiningDate)}
      />
    </SectionCard>
  );
}