import type { Program, ProgramType } from "@/pages/Programs/types";
import { PROGRAM_TYPES } from "@/pages/Programs/types";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface ProgramTableProps {
  programs: Program[];
  onEdit: (program: Program) => void;
  onDelete: (program: Program) => void;
}

const typeLabel = (type: ProgramType) =>
  PROGRAM_TYPES.find((pt) => pt.value === type)?.label ?? type;

const typeBadgeVariant = (
  type: ProgramType
): "default" | "secondary" | "outline" | "destructive" => {
  switch (type) {
    case "UNDERGRADUATE":
      return "default";
    case "POSTGRADUATE":
      return "secondary";
    case "DOCTORATE":
      return "destructive";
    case "CERTIFICATION":
      return "outline";
    default:
      return "secondary";
  }
};

export function ProgramTable({
  programs,
  onEdit,
  onDelete,
}: ProgramTableProps) {
  if (programs.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        No programs found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-14" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program, index) => (
            <TableRow
              key={program.id}
              className="hover:bg-muted/40 odd:bg-background even:bg-muted/20"
            >
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell>
                <span className="font-semibold">{program.name}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {program.fullName || "—"}
              </TableCell>
              <TableCell>
                <Badge variant={typeBadgeVariant(program.programType)}>
                  {typeLabel(program.programType)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {program.durationMonths
                  ? `${program.durationMonths} months`
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={program.isActive ? "default" : "secondary"}
                  className={
                    program.isActive
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : ""
                  }
                >
                  {program.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => onEdit(program)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(program)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
