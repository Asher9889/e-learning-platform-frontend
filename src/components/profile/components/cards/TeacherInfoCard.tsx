import { Briefcase } from "lucide-react";



import { SectionCard } from "../shared/SectionCard";
import { InfoRow } from "../shared/InfoRow";
import type { TeacherRoleInfo } from "@/pages/Profile/types/profile.types";
import { formatDate } from "@/utils/profile.utils";

interface Props {
  roleInfo: TeacherRoleInfo;
}

export function TeacherInfoCard({
  roleInfo,
}: Props) {
  return (
    <SectionCard title="Professional Information" icon={Briefcase} accent="violet">
      <InfoRow
        label="Employee ID"
        value={roleInfo.employeeId}
      />

      <InfoRow
        label="Department"
        value={roleInfo.department}
      />

      <InfoRow
        label="Designation"
        value={roleInfo.designation}
      />

      <InfoRow
        label="Qualification"
        value={roleInfo.qualification}
      />

      <InfoRow
        label="Experience"
        value={`${roleInfo.experience} Years`}
      />

      <InfoRow
        label="Joining Date"
        value={formatDate(roleInfo.joiningDate)}
      />

      <InfoRow
        label="Subjects"
        value={roleInfo.subjects.join(", ")}
      />
    </SectionCard>
  );
}