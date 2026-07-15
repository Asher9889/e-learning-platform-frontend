import { ArrowRight, Award, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "./difficulty-badge";
import type { QuestionPaper } from "@/pages/Assignment/types/question-paper.types";


type Props = {
  paper: QuestionPaper;
  onStart?: (paper: QuestionPaper) => void;
};

export function QuestionPaperCard({ paper, onStart }: Props) {
  return (
    <Card className="group overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg">
      <CardContent className="space-y-5 p-6">
        <div>
          <h3 className="line-clamp-2 text-lg font-semibold">
            {paper.title}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {paper.topic.join(" • ")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <DifficultyBadge difficulty={paper.difficulty} />

          <Badge variant="secondary">
            {paper.questionTypes.join(", ")}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />

            <div>
              <p className="text-xs text-muted-foreground">
                Questions
              </p>

              <p className="font-semibold">
                {paper.questionCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />

            <div>
              <p className="text-xs text-muted-foreground">
                Marks
              </p>

              <p className="font-semibold">
                {paper.totalMarks}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full rounded-xl"
          onClick={() => onStart?.(paper)}
        >
          Start Paper

          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}