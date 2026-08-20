import { useState } from "react";
import { Search, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DUMMY_TRANSCRIPT = [
  { timeMs: 0, text: "Good morning everyone. Today we're going to discuss database normalization, which is one of the most fundamental concepts in database management systems." },
  { timeMs: 135000, text: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It was first proposed by Edgar F. Codd in 1970." },
  { timeMs: 300000, text: "Before we dive into the normal forms, let me explain why normalization matters. Without it, you end up with duplicate data, update anomalies, and deletion anomalies." },
  { timeMs: 522000, text: "The first normal form, or 1NF, requires that all column values be atomic. That means no repeating groups, no arrays, no comma-separated lists in a single cell." },
  { timeMs: 720000, text: "Let me show you an example. If you have a student table with a column called 'courses' that contains 'Math, Physics, Chemistry', that violates 1NF." },
  { timeMs: 900000, text: "The fix is to create a separate table for enrollments, where each row contains exactly one course per student. That's 1NF." },
  { timeMs: 1051000, text: "Now for the second normal form, or 2NF. This builds on 1NF and requires that every non-key attribute be fully functionally dependent on the entire primary key." },
  { timeMs: 1260000, text: "This mainly matters when you have composite primary keys. If you have a table with (StudentID, CourseID) as the key, and the TeacherName depends only on CourseID, that's a partial dependency." },
  { timeMs: 1500000, text: "To fix this, you move the partial dependency to a separate table. Now TeacherName depends on the full key of its own table." },
  { timeMs: 1764000, text: "Third normal form, 3NF, goes further. It requires that no non-key attribute depends on another non-key attribute. This is called a transitive dependency." },
  { timeMs: 1980000, text: "For example, if StudentID determines Department, and Department determines DepartmentHead, then DepartmentHead is transitively dependent on StudentID through Department." },
  { timeMs: 2160000, text: "The fix is to break this into separate tables: one for students with their department, and one for departments with their heads." },
  { timeMs: 2280000, text: "Boyce-Codd Normal Form, or BCNF, is a stricter version of 3NF. The difference is that in BCNF, every determinant must be a candidate key." },
  { timeMs: 2520000, text: "In practice, most well-designed databases satisfy 3NF. BCNF catches edge cases that 3NF misses." },
  { timeMs: 2700000, text: "To summarize: start with 1NF for atomic values, move to 2NF to remove partial dependencies, and reach 3NF to remove transitive dependencies. That gives you a solid relational design." },
  { timeMs: 2880000, text: "Next class, we'll look at actual SQL examples of creating normalized tables. Please review the slides and try the practice problems." },
];

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

interface TranscriptTabProps {
  onSeek?: (timeMs: number) => void;
}

export function TranscriptTab({ onSeek }: TranscriptTabProps) {
  const [search, setSearch] = useState("");

  const filtered = DUMMY_TRANSCRIPT.filter((entry) =>
    search
      ? entry.text.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search transcript..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Transcript entries */}
      <div className="space-y-1">
        {filtered.map((entry, i) => (
          <button
            key={i}
            onClick={() => onSeek?.(entry.timeMs)}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50",
              search &&
                entry.text.toLowerCase().includes(search.toLowerCase()) &&
                "bg-muted/30"
            )}
          >
            <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
              <Play className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-xs font-medium text-primary">
                {formatTime(entry.timeMs)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {highlightSearch(entry.text, search)}
            </p>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No matching transcript entries found.
        </div>
      )}
    </div>
  );
}

function highlightSearch(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="rounded bg-yellow-200 px-0.5 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-200">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
