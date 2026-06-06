export function CourseFilters({
  role,
}: any) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button className="px-3 py-1 border rounded-full text-sm">
        All
      </button>

      {role === "student" ? (
        <>
          <button className="px-3 py-1 border rounded-full text-sm">
            In Progress
          </button>

          <button className="px-3 py-1 border rounded-full text-sm">
            Completed
          </button>
        </>
      ) : (
        <>
          <button className="px-3 py-1 border rounded-full text-sm">
            My Courses
          </button>

          <button className="px-3 py-1 border rounded-full text-sm">
            Published
          </button>
        </>
      )}
    </div>
  );
}