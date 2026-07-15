import {
  MoreHorizontal,
  Eye,
  Send,
  Trash,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { StatusBadge } from "./status-badge";
import type { Assessment } from "@/pages/Assessments/types/assessment.types";

interface AssessmentTableProps {
  assessments: Assessment[];

  onView: (
    assessment: Assessment
  ) => void;

  onPublish: (
    assessment: Assessment
  ) => void;
}

export function AssessmentTable({
  assessments,
  onView,
  onPublish,
}: AssessmentTableProps) {
  if (
    assessments.length === 0
  ) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        No assessments found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>
              Title
            </TableHead>

            <TableHead>
              Type
            </TableHead>

            <TableHead>
              Difficulty
            </TableHead>

            <TableHead>
              Questions
            </TableHead>

            <TableHead>
              Marks
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="w-14" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {assessments.map(
            (
              assessment
            ) => (
              <TableRow
                key={
                  assessment.id
                }
                className="
                  hover:bg-muted/40
                  transition-colors
                "
              >
                <TableCell className="font-medium">
                  {
                    assessment.title
                  }
                </TableCell>

                <TableCell>
                  {
                    assessment.assessmentType
                  }
                </TableCell>

                <TableCell>
                  {
                    assessment.difficulty
                  }
                </TableCell>

                <TableCell>
                  {
                    assessment.questionCount
                  }
                </TableCell>

                <TableCell>
                  {
                    assessment.totalMarks
                  }
                </TableCell>

                <TableCell>
                  <StatusBadge
                    status={
                      assessment.status
                    }
                  />
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onView(
                            assessment
                          )
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>

                      {assessment.status ===
                        "DRAFT" && (
                        <DropdownMenuItem
                           onClick={() => onPublish(assessment)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {assessment.status ===
                        "DRAFT" && (
                        <DropdownMenuItem
                           onClick={() => onPublish(assessment)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          DELETE
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}