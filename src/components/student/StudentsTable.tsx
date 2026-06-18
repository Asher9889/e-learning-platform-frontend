import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "#components/ui/button";
import { Checkbox } from "#components/ui/checkbox";
import type { StudentDataFromApi, Pagination } from "@/pages/Student/schema/student.schema";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "#components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#components/ui/alert-dialog";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  UserX,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface Props {
  students: StudentDataFromApi[];
  pagination?: Pagination;
  page: number;
  onPageChange: (page: number) => void;
  onStudentClick: (student: StudentDataFromApi) => void;
  onEditStudent: (student: StudentDataFromApi) => void;
  onDeleteStudent: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onBulkStatusUpdate: (ids: string[], status: string) => void;
}

export function StudentsTable({
  students,
  pagination,
  page,
  onPageChange,
  onStudentClick,
  onEditStudent,
  onDeleteStudent,
  onToggleStatus,
  onBulkStatusUpdate,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<StudentDataFromApi | null>(null);

  const allSelected = students.length > 0 && selected.size === students.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(students.map((s) => s.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "default";
      case "INACTIVE": return "secondary";
      case "SUSPENDED": return "destructive";
      default: return "outline";
    }
  };

  if (students.length === 0) {
    return (
      <div className="rounded-sm border bg-card">
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <UsersIcon className="h-10 w-10 mb-3 opacity-40" />
          <p className="font-medium">No students found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  const from = pagination ? (pagination.page - 1) * pagination.limit + 1 : 1;
  const to = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : students.length;

  return (
    <>
      <div className="rounded-sm border bg-card shadow-sm">
        {selected.size > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
            <span className="text-sm text-muted-foreground">
              {selected.size} selected
            </span>
            <div className="ml-auto flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBulkStatusUpdate([...selected], "ACTIVE")}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Activate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => onBulkStatusUpdate([...selected], "INACTIVE")}
              >
                <UserX className="h-4 w-4 mr-1" />
                Deactivate
              </Button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="font-semibold min-w-[60px]">Roll No</TableHead>
                <TableHead className="font-semibold min-w-[220px]">Student</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Program</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Batch</TableHead>
                <TableHead className="font-semibold min-w-[100px]">Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student.id}
                  className="transition-colors hover:bg-muted/40 odd:bg-background even:bg-muted/20"
                  data-state={selected.has(student.id) ? "selected" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      checked={selected.has(student.id)}
                      onCheckedChange={() => toggleOne(student.id)}
                      aria-label={`Select ${student.personalInfo?.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {student.roleInfo?.rollNumber}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => onStudentClick(student)}
                      className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={student.personalInfo?.profileImage || ""} />
                        <AvatarFallback className="text-xs">
                          {student.personalInfo?.name?.charAt(0)?.toUpperCase() || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {student.personalInfo?.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {student.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.phoneNumber}
                        </div>
                      </div>
                    </button>
                  </TableCell>
                  <TableCell className="text-sm">
                    {student.roleInfo?.programName || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {student.roleInfo?.batchName || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariant(student.status)}
                      className="font-medium text-xs"
                    >
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                          student.status === "ACTIVE"
                            ? "bg-green-400"
                            : student.status === "INACTIVE"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                        }`}
                      />
                      {student.status.charAt(0) + student.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => onStudentClick(student)}>
                          <Eye className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditStudent(student)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit Student
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {student.status === "ACTIVE" ? (
                          <DropdownMenuItem onClick={() => onToggleStatus(student.id, student.status)}>
                            <UserX className="mr-2 h-4 w-4" /> Deactivate Account
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => onToggleStatus(student.id, student.status)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Activate Account
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(student)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
            <span>
              Showing {from}–{to} of {pagination.total} students
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={p === page ? "default" : "ghost"}
                      size="icon-sm"
                      onClick={() => onPageChange(p)}
                      className={p === page ? "pointer-events-none" : ""}
                    >
                      {p}
                    </Button>
                  </span>
                ))}
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={page >= pagination.totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.personalInfo?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) onDeleteStudent(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function UsersIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
