import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus } from "lucide-react";

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
import type { Options, Teacher } from "@/pages/Teacher/schema/teacher.schema";
import { useGetClassSubjectsSummary } from "@/pages/Live-Classes/hooks/useGetClassSubjectsSummary";
import { useEffect } from "react";
import { mapToLabelValue } from "@/utils/helper";
import { useStartLiveClass } from "@/pages/Live-Classes/hooks/useStartLiveClass";
import { sileo } from "sileo";

interface Props {
  teachersOptions: Options[];
  gradeOptions: Options[];
  onSuccess?: () => void;
}

// const SUBJECTS = [
//   "Mathematics",
//   "Physics",
//   "Chemistry",
//   "Biology",
//   "Computer Science",
// ];

// const GRADES = [
//   { id: "g1", name: "Class 6" },
//   { id: "g2", name: "Class 7" },
//   { id: "g3", name: "Class 8" },
//   { id: "g4", name: "Class 9" },
//   { id: "g5", name: "Class 10" },
// ];

// const TEACHERS = [
//   { id: "t1", name: "Mr. Sharma" },
//   { id: "t2", name: "Ms. Verma" },
//   { id: "t3", name: "Dr. Gupta" },
// ];

export default function ScheduleLiveClassForm({ onSuccess, teachersOptions, gradeOptions }: Props) {
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
      gradeId: "",
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
    isPending,
  } = useStartLiveClass();
  const selectedGrade = watch("gradeId");
  const { data: subjectsData } = useGetClassSubjectsSummary(
    true,
     gradeOptions.find(
      (g) => g.value === selectedGrade
    )?.label
  );
  const selectedSubject: any[] = subjectsData || [];
  console.log(subjectsData, "subjectsDatahgfdahgwfdhgafwdgf")
  const subjectDataOptions = mapToLabelValue(selectedSubject, "name", "id") || [];
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

      {/* SUBJECT + GRADE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Grade</Label>
          <Select onValueChange={(v) => setValue("gradeId", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {gradeOptions.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Subject</Label>
          <Select onValueChange={(v) => setValue("subjectId", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjectDataOptions?.length > 0 ? subjectDataOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              )) : <SelectItem value="no-subject-found" disabled>
                No Subject Found
              </SelectItem>}
            </SelectContent>
          </Select>
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