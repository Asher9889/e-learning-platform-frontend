import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { Textarea } from "#components/ui/textarea";
import { Label } from "#components/ui/label";
import { Switch } from "#components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { startLiveClassSchema, type TStartLiveClassInput } from "../schema/live.schema";
// import { useCreateLiveClass } from "../hooks/useLiveClass";

interface CreateLiveClassDialogProps {
  onSuccess?: () => void;
}

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "History",
  "Geography",
];

const CreateLiveClassDialog = ({ onSuccess }: CreateLiveClassDialogProps) => {
  const [open, setOpen] = useState(false);
  // const createMutation = useCreateLiveClass();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TStartLiveClassInput>({
    resolver: zodResolver(startLiveClassSchema),
    defaultValues: {
      durationMinutes: 60,
      maxParticipants: 50,
      isRecordingEnabled: true,
      isChatEnabled: true,
      isScreenShareAllowed: true,
    },
  });

  const onSubmit = async (_data: TStartLiveClassInput) => {
    // await createMutation.mutateAsync(_data);
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Live Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg   max-h-[80vh]  overflow-y-auto">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
            <Video className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-lg">Start a Live Class</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Configure your session settings before going live.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Class Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Advanced Calculus - Week 5"
              {...register("title")}
              className="h-10"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Subject
            </Label>
            <Select onValueChange={(v) => setValue("subject", v)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className="text-xs text-destructive">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description <span className="font-normal normal-case text-muted-foreground/60">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Brief overview of what will be covered..."
              {...register("description")}
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="duration" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Duration (min)
              </Label>
              <Select
                defaultValue="60"
                onValueChange={(v) => setValue("durationMinutes", Number(v))}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[30, 45, 60, 90, 120, 180].map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="participants" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Max Students
              </Label>
              <Select
                defaultValue="50"
                onValueChange={(v) => setValue("maxParticipants", Number(v))}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100, 250, 500].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} students
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Session Options
            </p>
            {[
              { key: "isRecordingEnabled", label: "Record Session", desc: "Save for later review" },
              { key: "isChatEnabled", label: "Student Chat", desc: "Allow Q&A during class" },
              { key: "isScreenShareAllowed", label: "Screen Sharing", desc: "Present slides and demos" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-[11px] text-muted-foreground">{desc}</span>
                </div>
                <Switch
                  checked={watch(key as keyof TStartLiveClassInput) as boolean}
                  onCheckedChange={(checked) => setValue(key as keyof TStartLiveClassInput, checked)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gap-2"
            >
              <Video className="h-4 w-4" />
              Create & Schedule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLiveClassDialog