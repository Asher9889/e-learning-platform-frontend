import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import type { TeacherEnrollFormInput } from "@/pages/Teacher/schema/teacher.schema";

interface Props {
  teachers: TeacherEnrollFormInput[];
}

export function TeachersTable({
  teachers,
}: Props) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Qualification</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {teachers.map((teacher,index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {teacher?.personalInfo?.name}
              </TableCell>

              <TableCell>
                {teacher?.roleInfo?.qualification}
              </TableCell>

              <TableCell>
                {teacher?.roleInfo?.specialization}
              </TableCell>

              <TableCell>
                {teacher?.roleInfo?.experienceYears} Years
              </TableCell>

              <TableCell>
                {teacher.email}
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    teacher.status === "ACTIVE"
                      ? "default"
                      : "secondary"
                  }
                >
                  {teacher.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}