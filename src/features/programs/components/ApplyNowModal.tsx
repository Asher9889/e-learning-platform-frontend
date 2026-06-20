import { CheckCircle2, Clock, GraduationCap, IndianRupee } from "lucide-react";
import { sileo } from "sileo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Program } from "../types/program.types";

interface ApplyNowModalProps {
  program: Program | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyNowModal({ program, open, onOpenChange }: ApplyNowModalProps) {
  if (!program) return null;

  const handleStartAdmission = () => {
    onOpenChange(false);
    sileo.success({
      title: "Admission flow will be integrated soon.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{program.name}</DialogTitle>
          <DialogDescription>
            Review program details before starting your application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Program Fee</p>
                  <p className="font-semibold">{program.fee}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold">{program.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className="font-semibold">{program.mode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Eligibility</p>
                  <p className="font-semibold">{program.eligibility}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="mb-2 text-sm font-semibold">Benefits</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                Industry-recognized certification
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                Expert faculty with real-world experience
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                Flexible learning schedules
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                Dedicated placement assistance
              </li>
            </ul>
          </div>
          <Button className="w-full" size="lg" onClick={handleStartAdmission}>
            Start Admission Process
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
