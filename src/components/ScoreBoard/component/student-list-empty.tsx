// components/AssignmentResult/component/student-list-empty.tsx
import { Users } from "lucide-react"

export function StudentListEmpty({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
        <Users className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="font-medium">No students found</p>
      <p className="text-sm text-muted-foreground mt-1">
        {search
          ? `No results for "${search}". Try a different name or roll number.`
          : "Student results will show up here once available."}
      </p>
    </div>
  )
}