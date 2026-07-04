import {
  GraduationCap,
} from "lucide-react";




import { SectionCard } from "../shared/SectionCard";
import { InfoRow } from "../shared/InfoRow";
import type { StudentRoleInfo } from "@/pages/Profile/types/profile.types";
import { formatDate } from "@/utils/profile.utils";

interface Props {
  roleInfo: StudentRoleInfo;
}

export function StudentInfoCard({
  roleInfo,
}: Props) {
  return (
    <SectionCard title="Academic Information" icon={GraduationCap} accent="violet">
      <InfoRow
        label="Roll Number"
        value={roleInfo.rollNumber}
      />

      <InfoRow
        label="Admission Date"
        value={formatDate(roleInfo.admissionDate)}
      />

      <InfoRow
        label="Program"
        value={roleInfo.program?.name}
      />

      <InfoRow
        label="Batch"
        value={roleInfo.batch?.name}
      />

      <InfoRow
        label="Guardian Name"
        value={roleInfo.guardianName}
      />

      <InfoRow
        label="Guardian Phone"
        value={roleInfo.guardianPhoneNumber}
      />
    </SectionCard>
  );
}