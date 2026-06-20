import { useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStudents } from "./hooks/useStudentsList";
import { useStudentStats } from "./hooks/useStudentStats";
import {
  useDeleteStudent,
  useUpdateStudentStatus,
  useBulkUpdateStudentStatus,
} from "./hooks/useStudentMutations";
import { StudentsTable } from "@/components/student/StudentsTable";
import { StudentFilters } from "@/components/student/StudentFilters";
import { StudentStatsCards } from "@/components/student/StudentStatsCards";
import { StudentDrawer } from "@/components/student/StudentDrawer";
import type { StudentDataFromApi } from "./schema/student.schema";

export default function StudentsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const programId = searchParams.get("programId") || "";
  const batchId = searchParams.get("batchId") || "";
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [selectedStudent, setSelectedStudent] = useState<StudentDataFromApi | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const setFilters = useCallback(
    (updates: Record<string, string>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        next.set("page", "1");
        return next;
      });
    },
    [setSearchParams]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(p));
        return next;
      });
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const filters = useMemo(
    () => ({
      ...(programId && { programId }),
      ...(batchId && { batchId }),
      ...(status && { status }),
      ...(search && { search }),
      page,
      limit: 20,
      sortBy: "createdAt" as const,
      sortOrder: "desc" as const,
    }),
    [programId, batchId, status, search, page]
  );

  const { data, isLoading } = useStudents(
    programId && batchId ? filters : undefined
  );

  const { data: statsData } = useStudentStats();

  const { mutate: deleteStudent } = useDeleteStudent();
  const { mutate: toggleStatus } = useUpdateStudentStatus();
  const { mutate: bulkStatus } = useBulkUpdateStudentStatus();

  const students = data?.data?.students || [];
  const pagination = data?.data?.pagination;

  const hasFilters = !!(programId && batchId);

  const handleStudentClick = useCallback((student: StudentDataFromApi) => {
    setSelectedStudent(student);
    setDrawerOpen(true);
  }, []);

  const handleEditStudent = useCallback(
    (student: StudentDataFromApi) => {
      navigate(`/student/${student.id}/edit`);
    },
    [navigate]
  );

  const handleDeleteStudent = useCallback(
    (id: string) => {
      deleteStudent(id);
    },
    [deleteStudent]
  );

  const handleToggleStatus = useCallback(
    (id: string, currentStatus: string) => {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      toggleStatus({ id, status: newStatus });
    },
    [toggleStatus]
  );

  const handleBulkStatusUpdate = useCallback(
    (ids: string[], newStatus: string) => {
      bulkStatus({ studentIds: ids, status: newStatus as "ACTIVE" | "INACTIVE" | "SUSPENDED" });
    },
    [bulkStatus]
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground text-sm">
            Manage student records, enrollment and access
          </p>
        </div>
        <Button onClick={() => navigate("add")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <StudentFilters
        programId={programId}
        batchId={batchId}
        status={status}
        search={search}
        onProgramChange={(v) => setFilters({ programId: v, batchId: "" })}
        onBatchChange={(v) => setFilters({ batchId: v })}
        onStatusChange={(v) => setFilters({ status: v })}
        onSearchChange={(v) => setFilters({ search: v })}
        onClear={clearFilters}
      />

      <StudentStatsCards stats={statsData?.data} />

      {!hasFilters ? (
        <div className="rounded-sm border bg-card flex flex-col items-center justify-center h-64 text-muted-foreground">
          <UsersIcon className="h-12 w-12 mb-4 opacity-30" />
          <p className="font-medium text-base">Select a Program and Batch</p>
          <p className="text-sm">to view students</p>
        </div>
      ) : isLoading ? (
        <div className="rounded-sm border bg-card flex items-center justify-center h-48 text-muted-foreground">
          Loading students...
        </div>
      ) : (
        <StudentsTable
          students={students}
          pagination={pagination}
          page={page}
          onPageChange={handlePageChange}
          onStudentClick={handleStudentClick}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteStudent}
          onToggleStatus={handleToggleStatus}
          onBulkStatusUpdate={handleBulkStatusUpdate}
        />
      )}

      <StudentDrawer
        student={selectedStudent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
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
