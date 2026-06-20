import { Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Program } from "../types/program.types";

interface FeaturedProgramsProps {
  programs: Program[];
  onViewDetails: (slug: string) => void;
  onApplyNow: (program: Program) => void;
}

export function FeaturedPrograms({
  programs,
  onViewDetails,
  onApplyNow,
}: FeaturedProgramsProps) {
  if (programs.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-primary text-primary" />
          <h2 className="text-2xl font-bold">Featured Programs</h2>
        </div>
        <p className="mt-1 text-muted-foreground">
          Most popular programs among students.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {programs.slice(0, 4).map((program) => (
          <Card
            key={program.id}
            className="group relative overflow-hidden border-primary/10 bg-gradient-to-br from-primary/[0.02] to-background transition-all hover:border-primary/20 hover:shadow-md"
          >
            <CardContent className="p-5">
              <Badge variant="secondary" className="mb-3">
                {program.category}
              </Badge>
              <h3 className="mb-1 font-semibold line-clamp-2">{program.name}</h3>
              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                {program.description}
              </p>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{program.fee}</span>
                <span className="text-xs text-muted-foreground">{program.duration}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onViewDetails(program.slug)}
                >
                  Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => onApplyNow(program)}
                >
                  Apply
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
