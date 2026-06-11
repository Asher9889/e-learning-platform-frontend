import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import type { Grade } from "@/pages/Classes/schema/grade.schema";


interface Props {
  grades: Grade[];
  onEdit?: (grade: Grade) => void;
  onDelete?: (grade: Grade) => void;
}

export function ClassesTable({
  grades,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-16">
              #
            </TableHead>

            <TableHead>
              Class Name
            </TableHead>

            <TableHead>
              Normalized Name
            </TableHead>

            <TableHead>
              Description
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="w-32 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {grades.length > 0 ? (
            grades.map((grade, index) => (
              <TableRow
                key={grade.id}
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
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium">
                        {grade.name}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="font-mono text-muted-foreground">
                  {grade.normalizedName}
                </TableCell>

                <TableCell className="max-w-[300px] truncate text-muted-foreground">
                  {grade.description || "-"}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      grade.isActive
                        ? "default"
                        : "secondary"
                    }
                  >
                    {grade.isActive
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        onEdit?.(grade)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() =>
                        onDelete?.(grade)
                      }
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
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
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