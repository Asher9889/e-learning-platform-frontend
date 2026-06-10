import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import type { TeacherDataFromApi } from "@/pages/Teacher/schema/teacher.schema";
import { Avatar, AvatarFallback, AvatarImage } from "#components/ui/avatar";

interface Props {
  teachers: TeacherDataFromApi[];
}

export function TeachersTable({
  teachers,
}: Props) {


  console.log(teachers, "teachers")


  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Sr. No.</TableHead>
            <TableHead className="w-20">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Qualification</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {teachers && teachers.length > 0 && teachers.map((teacher, index) => (
            <TableRow
              key={teacher.email}
            >
              <TableCell>
                {index + 1}
              </TableCell>

              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={teacher.personalInfo?.profileImage || ""}
                  />

                  <AvatarFallback>
                    {teacher.personalInfo?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "T"}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
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