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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "#components/ui/avatar";

interface Props {
  students: StudentDataFromApi[];
}

export function StudentsTable({ students }: Props) {
  return (
    <div className="overflow-x-auto rounded-sm border bg-card shadow-sm">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-16 font-semibold">
              Sr. No.
            </TableHead>

            <TableHead className="w-20 font-semibold">
              Avatar
            </TableHead>

            <TableHead className="font-semibold">
              Name
            </TableHead>

            <TableHead className="font-semibold">
              Roll No
            </TableHead>

            <TableHead className="font-semibold">
              Batch
            </TableHead>

            <TableHead className="font-semibold">
              Email
            </TableHead>

            <TableHead className="font-semibold">
              Phone
            </TableHead>

            <TableHead className="font-semibold">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <TableRow
                key={student.email}
                className="
                  transition-colors
                  hover:bg-muted/40
                  odd:bg-background
                  even:bg-muted/20
                "
              >
                <TableCell className="font-medium">
                  {index + 1}
                </TableCell>

                <TableCell>
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={student.personalInfo?.profileImage || ""}
                    />

                    <AvatarFallback>
                      {student.personalInfo?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "S"}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                <TableCell>
                  <div className="font-medium">
                    {student.personalInfo?.name}
                  </div>
                </TableCell>

                <TableCell className="font-mono">
                  {student.roleInfo?.rollNumber}
                </TableCell>

                <TableCell>
                  {student.roleInfo?.batch}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {student.email}
                </TableCell>

                <TableCell className="font-mono">
                  {student.phoneNumber}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      student.status === "ACTIVE"
                        ? "default"
                        : "secondary"
                    }
                    className="font-medium"
                  >
                    {student.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-32 text-center text-muted-foreground"
              >
                No students found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}