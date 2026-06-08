// index.tsx

import { useState } from "react";

import { StudentHeader } from "../../components/enrollstudent/StudentHeader";
import { StudentsTable } from "../../components/enrollstudent/StudentsTable";
import { StudentEnrollDialog } from "../../components/enrollstudent/StudentEnrollDialog";

import { students } from "./data/students";

export default function StudentsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <StudentHeader
        onAddStudent={() => setOpen(true)}
      />

      <StudentsTable students={students} />

      <StudentEnrollDialog
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}