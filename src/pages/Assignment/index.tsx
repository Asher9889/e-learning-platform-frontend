import {  useMemo, useState } from "react";
import { BookOpen } from "lucide-react";



import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { QUESTION_PAPERS } from "./data/dummy-question-papers";
import type { Difficulty, QuestionPaper } from "./types/question-paper.types";
import { SearchBar } from "#components/Assignment/component/search-bar";
import { EmptyState } from "#components/Assignment/component/empty-state";
import { QuestionPaperGrid } from "#components/Assignment/component/question-paper-grid";
import { InstructionDialog } from "#components/Assignment/component/instruction-dialog";
import { useNavigate } from "react-router-dom";
import { useAssignments } from "./hook/useAssignment";
export default function Assignment() {
  const { data: assessments = [] } = useAssignments({
    page: 1,
    limit: 10,
    status: "PUBLISHED",
  });

  console.log(assessments,"data1574")
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<
    Difficulty | "ALL"
  >("ALL");
  const [selectedPaper, setSelectedPaper] =
    useState<QuestionPaper | null>(null);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const filteredPapers = useMemo(() => {
    if (!assessments) return [];
    return assessments?.filter((paper) => {
      const matchesDifficulty =
        difficulty === "ALL" || paper.difficulty === difficulty;

      const keyword = search.toLowerCase();

      const matchesSearch =
        paper.title.toLowerCase().includes(keyword) ||
        paper.topic.some((topic) =>
          topic.toLowerCase().includes(keyword)
        );

      return matchesDifficulty && matchesSearch;
    });
  }, [search, difficulty,assessments]);

  const handleStart = (paper: QuestionPaper) => {
    setSelectedPaper(paper);
    setDialogOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      {/* Header */}

      <div className="rounded-3xl border bg-gradient-to-r from-primary/10 via-background to-background p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <BookOpen className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Question Papers
            </h1>

            <p className="mt-2 text-muted-foreground">
              Practice with published question papers and
              improve your performance.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>

        <Select
          value={difficulty}
          onValueChange={(value) =>
            setDifficulty(value as Difficulty | "ALL")
          }
        >
          <SelectTrigger className="w-full md:w-52">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">
              All Difficulties
            </SelectItem>

            <SelectItem value="EASY">
              Easy
            </SelectItem>

            <SelectItem value="MEDIUM">
              Medium
            </SelectItem>

            <SelectItem value="HARD">
              Hard
            </SelectItem>

            <SelectItem value="MIXED">
              Mixed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}

      <div className="flex items-center justify-between rounded-2xl border bg-muted/30 px-5 py-4">
        <p className="text-sm text-muted-foreground">
          Showing
          <span className="mx-1 font-semibold text-foreground">
            {filteredPapers.length}
          </span>
          Question Papers
        </p>
      </div>

      {/* List */}

      {filteredPapers.length === 0 ? (
        <EmptyState />
      ) : (
        <QuestionPaperGrid
          papers={filteredPapers}
          onStart={handleStart}
        />
      )}

      <InstructionDialog
        open={dialogOpen}
        paper={selectedPaper}
        onClose={() => setDialogOpen(false)}
        onStart={() => {
          console.log("Start Attempt",selectedPaper?.id);

          // Next Phase
          navigate(`/assignments/${selectedPaper?.id}`);
        }}
      />
    </div>
  );
}