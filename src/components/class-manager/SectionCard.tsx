import type { Section } from "@/pages/Classes/types/index";
import { StrengthBadge } from "./StrengthBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface SectionCardProps {
  section: Section;
  onEdit: (section: Section) => void;
  onDelete: (section: Section) => void;
}

export function SectionCard({ section, onEdit, onDelete }: SectionCardProps) {
  return (
    <div className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">
            {section.name.charAt(section.name.length - 1)}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{section.name}</p>
          <p className="text-xs text-muted-foreground">
            {section.strength} {section.strength === 1 ? "student" : "students"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <StrengthBadge strength={section.strength} size="sm" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(section)} className="gap-2 cursor-pointer">
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(section)} 
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
