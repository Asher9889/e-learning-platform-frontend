import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CTASectionProps {
  onApplyNow: () => void;
  onContactAdmissions: () => void;
}

export function CTASection({ onApplyNow, onContactAdmissions }: CTASectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
        <CardContent className="flex flex-col items-center gap-6 p-10 text-center sm:p-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Apply today and take the next step toward your academic and
            professional success.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2" onClick={onApplyNow}>
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onContactAdmissions}
            >
              Contact Admissions
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
