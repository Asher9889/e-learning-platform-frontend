// StudentsTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import type { Student } from "@/types/student.type";


interface Props {
  students: Student[];
}

export function StudentsTable({
  students,
}: Props) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Roll No</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                {student.name}
              </TableCell>

              <TableCell>
                {student.rollNumber}
              </TableCell>

              <TableCell>
                {student.batch}
              </TableCell>

              <TableCell>
                {student.email}
              </TableCell>

              <TableCell>
                {student.phone}
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    student.status ===
                    "active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {student.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}