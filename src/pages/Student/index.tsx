// index.tsx

import { StudentHeader } from "../../components/student/StudentHeader";
import { StudentsTable } from "../../components/student/StudentsTable";
import { useNavigate } from "react-router-dom";
import { useStudents } from "./hooks/useStudentsLIst";

export default function StudentsPage() {
const navigate = useNavigate();
const {data, isLoading, isError } = useStudents();

  const students = data?.students || [];
console.log(students,"studentsstudents")
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
      <StudentHeader
        onAddStudent={() => navigate("add")}
      />
      <StudentsTable students={students} />
    </div>
  );
}