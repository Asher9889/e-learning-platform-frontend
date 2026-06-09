// index.tsx


import { useNavigate } from "react-router-dom";
import { TeacherHeader } from "#components/teacher/TeacherHeader";
import { TeachersTable } from "#components/teacher/TeachersTable";
import { useTeachers } from "./hooks/useTeachers";

export default function StudentsPage() {
const navigate = useNavigate();
const {data, isLoading, isError } = useTeachers();

  const teachers = data?.teachers || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }
  

  if (isError) {
    return (
      <div>
        Failed to load teachers
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      <TeacherHeader
        onAddStudent={() => navigate("new")}
      />
      <TeachersTable teachers={teachers} />
    </div>
  );
}