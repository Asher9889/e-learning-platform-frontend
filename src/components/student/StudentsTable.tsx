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
import type { StudentDataFromApi } from "@/pages/Student/schema/student.schema";
import { Avatar, AvatarFallback, AvatarImage } from "#components/ui/avatar";


interface Props {
  students: StudentDataFromApi[];
}

export function StudentsTable({
  students,
}: Props) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Sr. No.</TableHead>
            <TableHead className="w-20">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Roll No</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student,index) => (
            <TableRow
              key={student.email}
            >
               <TableCell>
                {index + 1}
              </TableCell>

              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={student.personalInfo?.profileImage || ""}
                  />

                  <AvatarFallback>
                    {student.personalInfo?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "T"}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                {student?.personalInfo?.name}
              </TableCell>

              <TableCell>
                {student?.roleInfo?.rollNumber}
              </TableCell>

              <TableCell>
                {student?.roleInfo?.batch}
              </TableCell>

              <TableCell>
                {student.email}
              </TableCell>

              <TableCell>
                {student.phoneNumber}
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    student.status === "ACTIVE"
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