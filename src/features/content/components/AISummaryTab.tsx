import { Sparkles, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DUMMY_SUMMARY = {
  generatedAt: "Aug 19, 2026",
  text: "This class introduces database normalization and explains first, second, and third normal forms. The teacher walks through practical examples of how normalization reduces data redundancy and improves data integrity in relational databases.",
  keyTopics: ["Normalization", "1NF", "2NF", "3NF", "Functional Dependencies", "Boyce-Codd Normal Form"],
  keyTakeaways: [
    "Normalization reduces data redundancy and improves data integrity.",
    "1NF requires all column values to be atomic (no repeating groups).",
    "2NF removes partial dependencies on composite primary keys.",
    "3NF removes transitive dependencies between non-key attributes.",
    "BCNF is a stricter version of 3NF where every determinant must be a candidate key.",
  ],
  chapters: [
    { timeMs: 135000, label: "Introduction to Normalization" },
    { timeMs: 522000, label: "First Normal Form (1NF)" },
    { timeMs: 1051000, label: "Second Normal Form (2NF)" },
    { timeMs: 1764000, label: "Third Normal Form (3NF)" },
    { timeMs: 2280000, label: "Boyce-Codd Normal Form" },
    { timeMs: 2700000, label: "Summary and Q&A" },
  ],
};

function formatChapterTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

interface AISummaryTabProps {
  onSeek?: (timeMs: number) => void;
}

export function AISummaryTab({ onSeek }: AISummaryTabProps) {
  const summary = DUMMY_SUMMARY;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">AI Summary</h3>
          <p className="text-xs text-muted-foreground">
            Generated on {summary.generatedAt}
          </p>
        </div>
      </div>

      {/* Summary text */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm leading-relaxed text-foreground">
          {summary.text}
        </p>
      </div>

      {/* Key Topics */}
      <div>
        <h4 className="mb-2.5 text-sm font-semibold">Key Topics</h4>
        <div className="flex flex-wrap gap-2">
          {summary.keyTopics.map((topic) => (
            <Badge key={topic} variant="secondary" className="font-normal">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Key Takeaways */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Key Takeaways</h4>
        <ul className="space-y-2.5">
          {summary.keyTakeaways.map((takeaway, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="leading-relaxed text-foreground">{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* AI Chapters */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">AI Chapters</h4>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {summary.chapters.map((chapter, i) => (
                <button
                  key={i}
                  onClick={() => onSeek?.(chapter.timeMs)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-xs font-semibold text-primary">
                    {formatChapterTime(chapter.timeMs)}
                  </span>
                  <span className="text-sm text-foreground">{chapter.label}</span>
                  <Play className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
