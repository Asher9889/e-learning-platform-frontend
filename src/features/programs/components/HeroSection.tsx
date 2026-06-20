import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onBrowsePrograms: () => void;
  onContactAdmissions: () => void;
}

export function HeroSection({ onBrowsePrograms, onContactAdmissions }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/[0.02] to-background bg-red-500">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>Academic Year 2025-26 Admissions Open</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Explore Our
            <span className="block text-primary">Programs</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Choose from school, diploma, undergraduate, and professional programs
            designed to help you achieve your academic and career goals.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={onBrowsePrograms}
              className="w-full sm:w-auto gap-2"
            >
              Browse Programs
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onContactAdmissions}
              className="w-full sm:w-auto"
            >
              Contact Admissions
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
