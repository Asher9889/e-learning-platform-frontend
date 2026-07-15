import type { QuestionPaper } from "@/pages/Assignment/types/question-paper.types";
import { QuestionPaperCard } from "./question-paper-card";


type Props = {
  papers: QuestionPaper[];
  onStart: (paper: QuestionPaper) => void;
};

export function QuestionPaperGrid({
  papers,
  onStart,
}: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {papers.map((paper) => (
        <QuestionPaperCard
          key={paper.id}
          paper={paper}
          onStart={onStart}
        />
      ))}
    </div>
  );
}