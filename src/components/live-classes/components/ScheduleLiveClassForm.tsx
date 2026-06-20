import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Users } from "lucide-react";

import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import { Textarea } from "#components/ui/textarea";
import { Switch } from "#components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";

import {
  startLiveClassSchema,
  type TStartLiveClassInput,
} from "@/pages/Live-Classes/schema/live.class.schema";
import type { Options } from "@/pages/Teacher/schema/teacher.schema";
import { useGetSubjects } from "@/pages/Subjects/hooks/useGetSubjects";
import { useGetBatches } from "@/pages/Batches/hooks/useGetBatches";
import { mapToLabelValue } from "@/utils/helper";
import { useStartLiveClass } from "@/pages/Live-Classes/hooks/useStartLiveClass";
import { sileo } from "sileo";

interface Props {
  teachersOptions: Options[];
  programOptions: Options[];
  onSuccess?: () => void;
}

export default function ScheduleLiveClassForm({ onSuccess, teachersOptions, programOptions }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TStartLiveClassInput>({
    resolver: zodResolver(startLiveClassSchema),
    defaultValues: {
      title: "",
      description: "",
      subjectId: "",
      programId: "",
      batchId: "",
      teacherId: "",
      scheduledAt: new Date().toISOString(),
      durationMinutes: 60,
      maxParticipants: 50,
      isRecordingEnabled: true,
      isChatEnabled: true,
      isScreenShareAllowed: true,
    },
  });
   const {
    mutate: startLiveClassMutation,
  } = useStartLiveClass();
  const selectedProgram = watch("programId");
  const selectedBatch = watch("batchId");
  const { data: subjectsData } = useGetSubjects(selectedProgram);
  const subjects = subjectsData?.subjects || [];
  const subjectDataOptions = mapToLabelValue(subjects, "name", "id") || [];
  const { data: batchesData } = useGetBatches(selectedProgram);
  const batches = batchesData?.batches || [];
  const batchOptions = mapToLabelValue(batches, "name", "id") || [];
  const selectedBatchLabel = batches.find((b) => b.id === selectedBatch)?.name;

  useEffect(() => {
    setValue("batchId", "");
  }, [selectedProgram]);
 const onSubmit = async (data: TStartLiveClassInput) => {
     console.log(data);
     startLiveClassMutation({...data,status:"SCHEDULED"}, {
     onSuccess: (response) => {
       console.log(response);
 
       onSuccess?.();
     },
 
     onError: (error) => {
       console.error(error);
      sileo.error({
        title: "Failed to Schedule",
        description: error.message || "An error occurred while starting the live class. Please try again.",
    })
     },
   });
   };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto px-1 pb-2"
    >

      {/* TITLE */}
      <div className="space-y-1">
        <Label>Title</Label>
        <Input {...register("title")} placeholder="e.g. Introduction to Algebra" />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* SUBJECT + PROGRAM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Program</Label>
          <Select onValueChange={(v) => setValue("programId", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              {programOptions.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Subject</Label>
          <Select
            disabled={!selectedProgram}
            onValueChange={(v) => setValue("subjectId", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  !selectedProgram
                    ? "Please select program first"
                    : subjectDataOptions?.length > 0
                    ? "Select subject"
                    : "No Subject Found"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {!selectedProgram ? (
                <SelectItem value="select-program-first" disabled>
                  Please select program first
                </SelectItem>
              ) : subjectDataOptions?.length > 0 ? (
                subjectDataOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-subject-found" disabled>
                  No Subject Found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* BATCH */}
      <div className="space-y-1">
        <Label>Batch (optional)</Label>
        <Select
          value={selectedBatch || "__all__"}
          disabled={!selectedProgram}
          onValueChange={(v) => setValue("batchId", v === "__all__" ? "" : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                !selectedProgram
                  ? "Please select program first"
                  : "All students in this program"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All students in this program</SelectItem>
            {batchOptions.map((b) => (
              <SelectItem key={b.value} value={b.value}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-start gap-2 mt-1.5">
          <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            {!selectedProgram
              ? "Select a program to choose a batch"
              : !selectedBatch
              ? "All students enrolled in this program can join this class."
              : `Only students in the "${selectedBatchLabel}" batch can join this class.`}
          </p>
        </div>
      </div>

      {/* TEACHER */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Teacher</Label>
          <Select onValueChange={(v) => setValue("teacherId", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachersOptions?.length > 0 && teachersOptions.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            {...register("durationMinutes", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1">
        <Label>Description</Label>
        <Textarea
          {...register("description")}
          placeholder="Brief about what will be covered..."
          className="resize-none"
          rows={3}
        />
      </div>

      {/* SCHEDULE TIME */}
      <div className="space-y-1">
        <Label>Schedule date & time</Label>
        <Input
          type="datetime-local"
          onChange={(e) =>
            setValue("scheduledAt", new Date(e.target.value).toISOString())
          }
        />
        {errors.scheduledAt && (
          <p className="text-xs text-red-500">{errors.scheduledAt.message}</p>
        )}
      </div>

      {/* DURATION + MAX STUDENTS */}
      {/* <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            {...register("durationMinutes", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1">
          <Label>Max students</Label>
          <Input
            type="number"
            {...register("maxParticipants", { valueAsNumber: true })}
          />
        </div>
      </div> */}

      {/* SESSION OPTIONS */}
      <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Session options
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm">Record session</span>
            <span className="text-[11px] text-muted-foreground">
              Save for later review
            </span>
          </div>
          <Switch
            checked={watch("isRecordingEnabled")}
            onCheckedChange={(v) => setValue("isRecordingEnabled", v)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm">Student chat</span>
            <span className="text-[11px] text-muted-foreground">
              Allow Q&A during class
            </span>
          </div>
          <Switch
            checked={watch("isChatEnabled")}
            onCheckedChange={(v) => setValue("isChatEnabled", v)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm">Screen sharing</span>
            <span className="text-[11px] text-muted-foreground">
              Present slides and demos
            </span>
          </div>
          <Switch
            checked={watch("isScreenShareAllowed")}
            onCheckedChange={(v) => setValue("isScreenShareAllowed", v)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        <CalendarPlus className="mr-2 h-4 w-4" />
        Schedule class
      </Button>
    </form>
  );
}