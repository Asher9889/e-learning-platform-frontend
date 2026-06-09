// index.tsx

import { StudentHeader } from "../../components/student/StudentHeader";
import { StudentsTable } from "../../components/student/StudentsTable";
import { students } from "./data/students";
import { useNavigate } from "react-router-dom";

export default function StudentsPage() {
const navigate = useNavigate();
  return (
    <div className="space-y-6 p-6">
      <StudentHeader
        onAddStudent={() => navigate("add")}
      />
      <StudentsTable students={students} />
    </div>
  );
}