import { Award, Hash } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { Question } from "@/pages/Assignment/types/question-paper.types";
import { OptionCard } from "./OptionCard";
import { DifficultyBadge } from "../component/difficulty-badge";


type QuestionCardProps = {
  question: Question;
  selectedAnswer?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
};

export function QuestionCard({
  question,
  selectedAnswer,
  onSelect,
  disabled = false,
}: QuestionCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />

            <span className="font-semibold">
              Question {question.number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DifficultyBadge difficulty={question.difficulty} />

            <Badge
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Award className="h-3.5 w-3.5" />
              {question.marks} Marks
            </Badge>
          </div>
        </div>

        <h2 className="text-lg font-semibold leading-7">
          {question.question}
        </h2>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {question.options.map((option) => (
            <OptionCard
              key={option}
              option={option}
              selected={selectedAnswer === option}
              disabled={disabled}
              onSelect={onSelect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}