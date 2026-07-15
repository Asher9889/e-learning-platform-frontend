import { useEffect, useRef, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { StudentCard } from "./student-card"
import { StudentCardSkeleton } from "./student-card-skeleton"
import { StudentListEmpty } from "./student-list-empty"

interface Props {
  students: any[]
  isLoading: boolean
  search: string
  onViewStudent: (studentId: string) => void
}

function useColumnCount(ref: React.RefObject<HTMLDivElement | null> ) {
  const [columns, setColumns] = useState(3)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    const compute = () => {
      const width = el.clientWidth
      if (width < 640) setColumns(1)
      else if (width < 900) setColumns(2)
      else if (width < 1200) setColumns(3)
      else setColumns(4)
    }

    compute()
    const observer = new ResizeObserver(compute)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return columns
}

export function StudentList({
  students,
  isLoading,
  search,
  onViewStudent,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null)
  const columns = useColumnCount(parentRef)
  const rowCount = Math.ceil(students.length / columns)
console.log(students,"students rowStudents")
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 190,
    overscan: 3,
  })

  if (isLoading) {
    return (
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <StudentCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (students.length === 0) {
    return <StudentListEmpty search={search} />
  }

  return (
    <div ref={parentRef} className="h-[700px] overflow-auto">
      <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns
          const rowStudents = students.slice(startIndex, startIndex + columns)
          console.log(rowStudents,"rowStudents")
          return (
            <div
              key={virtualRow.key}
              className="grid gap-3 pb-3"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {rowStudents.map((student, i) => (
                <StudentCard
                  key={student?.studentId}
                  student={student}
                  rank={startIndex + i + 1}
                  onView={() => onViewStudent(student.studentId)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}