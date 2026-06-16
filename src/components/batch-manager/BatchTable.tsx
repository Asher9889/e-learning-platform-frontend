import type { Batch } from "@/pages/Batches/types";

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

interface BatchTableProps {
  batches: Batch[];
  onEdit: (batch: Batch) => void;
  onDelete: (batch: Batch) => void;
}

export function BatchTable({
  batches,
  onEdit,
  onDelete,
}: BatchTableProps) {
  if (batches.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        No batches found
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
            <TableHead>Program</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Max Students</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-14" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch, index) => (
            <TableRow
              key={batch.id}
              className="hover:bg-muted/40 odd:bg-background even:bg-muted/20"
            >
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell>
                <span className="font-semibold">{batch.name}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {batch.program?.name || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {batch.academicSession}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {batch.maxStudents != null ? batch.maxStudents : "—"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={batch.isActive ? "default" : "secondary"}
                  className={
                    batch.isActive
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : ""
                  }
                >
                  {batch.isActive ? "Active" : "Inactive"}
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
                    <DropdownMenuItem onClick={() => onEdit(batch)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(batch)}
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
