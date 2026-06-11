import { Video, Plus } from "lucide-react";
import { Button } from "#components/ui/button";

interface EmptyLiveClassStateProps {
  onCreate?: () => void;
}

const EmptyLiveClassState = ({ onCreate }: EmptyLiveClassStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
        <Video className="h-8 w-8 text-primary/60" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        No live classes scheduled
      </h3>
      <p className="max-w-xs text-sm text-muted-foreground mb-6">
        Schedule your first live session to start engaging with students in real-time.
      </p>
      {onCreate && (
        <Button onClick={onCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Live Class
        </Button>
      )}
    </div>
  );
};

export default EmptyLiveClassState;