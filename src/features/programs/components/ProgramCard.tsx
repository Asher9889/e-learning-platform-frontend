import { Clock, MapPin, GraduationCap, ArrowRight, ImageIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Program } from "../types/program.types";

interface ProgramCardProps {
  program: Program;
  onViewDetails: (slug: string) => void;
  onApplyNow: (program: Program) => void;
}

export function ProgramCard({ program, onViewDetails, onApplyNow }: ProgramCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {program.thumbnail ? (
          <img
            src={program.thumbnail}
            alt={program.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-primary/30" />
              <p className="mt-2 text-xs text-muted-foreground">{program.category}</p>
            </div>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge
            className={cn(
              "border-0",
              program.category === "School" && "bg-blue-500 hover:bg-blue-500",
              program.category === "Diploma" && "bg-green-500 hover:bg-green-500",
              program.category === "Undergraduate" && "bg-purple-500 hover:bg-purple-500",
              program.category === "Postgraduate" && "bg-orange-500 hover:bg-orange-500",
              program.category === "Professional" && "bg-rose-500 hover:bg-rose-500",
            )}
          >
            {program.category}
          </Badge>
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold leading-tight line-clamp-2">
          {program.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {program.description}
        </p>
        <div className="mt-auto grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{program.mode}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{program.eligibility}</span>
          </div>
        </div>
        <div className="pt-2">
          <p className="text-xl font-bold text-primary">{program.fee}</p>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-5 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(program.slug)}
        >
          View Details
        </Button>
        <Button
          size="sm"
          className="gap-1"
          onClick={() => onApplyNow(program)}
        >
          Apply Now
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
