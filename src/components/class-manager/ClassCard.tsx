import type { Class } from "@/pages/Classes/types/index";
import { SectionList } from "./SectionList";
import { StrengthBadge } from "./StrengthBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, GraduationCap, Calendar } from "lucide-react";
import { capitalizeFirstLetter } from "@/utils/helper";

interface ClassCardProps {
  classData: Class;
  onEdit: (classData: Class) => void;
  onDelete: (classData: Class) => void;
}

export function ClassCard({ classData, onEdit, onDelete }: ClassCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg leading-tight">{capitalizeFirstLetter(classData.name)}</CardTitle>
              <CardDescription className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {classData.academicYear}
                </span>
                <span className="text-muted-foreground">{classData.grade}</span>
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StrengthBadge strength={classData.totalStrength} size="lg" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(classData)} className="gap-2 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                  Edit Subject
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(classData)} 
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Subject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {classData.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {classData.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <SectionList sections={classData.sections} classId={classData.id} />
      </CardContent>
    </Card>
  );
}
