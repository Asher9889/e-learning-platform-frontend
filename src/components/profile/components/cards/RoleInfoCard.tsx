
import { StudentInfoCard } from "./StudentInfoCard";
import { TeacherInfoCard } from "./TeacherInfoCard";
import { AdminInfoCard } from "./AdminInfoCard";
import type { Profile } from "@/pages/Profile/types/profile.types";

interface Props {
  profile: Profile;
}

export function RoleInfoCard({
  profile,
}: Props) {
  switch (profile.role) {
    case "STUDENT":
      return (
        <StudentInfoCard
          roleInfo={profile.roleInfo}
        />
      );

    case "TEACHER":
      return (
        <TeacherInfoCard
          roleInfo={profile.roleInfo}
        />
      );

    case "ADMIN":
      return (
        <AdminInfoCard
          roleInfo={profile.roleInfo}
        />
      );
  }
}