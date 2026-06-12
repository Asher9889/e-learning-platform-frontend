import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Grade } from "@/pages/Classes/schema/grade.schema";



interface Props {
  grades: Grade[];
  onEdit: (grade: Grade) => void;
  onDelete: (grade: Grade) => void;
}

export function ClassesTable({
  grades,
  onEdit,
  onDelete,
}: Props) {
  console.log(grades,"grades")
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-20">
              Sr. No.
            </TableHead>

            <TableHead>
              Name
            </TableHead>

            <TableHead>
              Description
            </TableHead>

            <TableHead className="w-32 text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {grades.length > 0 ? (
            grades.map((grade, index) => (
              <TableRow
                key={grade.id}
                className="hover:bg-muted/30"
              >
                <TableCell className="font-medium">
                  {index + 1}
                </TableCell>

                <TableCell>
                  <div className="font-medium">
                    {grade.name}
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {grade.description || "-"}
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(grade)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(grade)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No classes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}