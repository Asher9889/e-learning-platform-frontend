import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, ChevronDown, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { scheduleLiveClassSchema, type TScheduleLiveClassInput } from "@/pages/Live-Classes/schema/live.class.schema";
import type { Options } from "@/pages/Teacher/schema/teacher.schema";
import { useGetSubjects } from "@/pages/Subjects/hooks/useGetSubjects";
import { useGetBatches } from "@/pages/Batches/hooks/useGetBatches";
import { capitalizeEachWord, mapToLabelValue } from "@/utils/helper";
import { useStartLiveClass } from "@/pages/Live-Classes/hooks/useStartLiveClass";
import { sileo } from "sileo";
import { useVideoSearch } from "@/hooks/use-video-search";
import queryClient from "@/config/queryClient";
import { DELIVERY_MODE } from "@/constants/live-class/live-class.constants";

interface Props {
  teachersOptions: Options[];
  programOptions: Options[];
  onSuccess?: () => void;
}

export default function ScheduleLiveClassForm({ onSuccess, teachersOptions, programOptions }: Props) {
  const [search] = useState("");

  const [programSearchOpen, setProgramSearchOpen] = useState(false);
  const [programSearch, setProgramSearch] = useState("");

  const [subjectSearchOpen, setSubjectSearchOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");

  const [teacherSearchOpen, setTeacherSearchOpen] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState("");

  const programRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const teacherRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<TScheduleLiveClassInput>({
    resolver: zodResolver(scheduleLiveClassSchema),
    defaultValues: {
      title: "",
      description: "",
      subjectId: "",
      programId: "",
      status: "SCHEDULED",
      deliveryMode: "LIVE",
      batchId: null,
      teacherId: "",
      scheduledAt: undefined,
      durationMinutes: 60,
      maxParticipants: 50,
      replayMaterialId: null,
      isRecordingEnabled: true,
      isChatEnabled: true,
      isScreenShareAllowed: true,
    },
    reValidateMode: "onChange"
  });

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        programRef.current &&
        !programRef.current.contains(target)
      ) {
        setProgramSearchOpen(false);
        setProgramSearch("");
      }

      if (
        subjectRef.current &&
        !subjectRef.current.contains(target)
      ) {
        setSubjectSearchOpen(false);
        setSubjectSearch("");
      }

      if (
        teacherRef.current &&
        !teacherRef.current.contains(target)
      ) {
        setTeacherSearchOpen(false);
        setTeacherSearch("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);



  const { data } = useVideoSearch(search);
  const dataRef = useRef(data);
  dataRef.current = data;

  const selectedOption = mapToLabelValue(data?.filter((materialData) => materialData?.materialType === "VIDEO"), "title", "id") || [];

  const classDeliveryMode = watch("deliveryMode");
  const durationValue = useWatch({ control, name: "durationMinutes" });
  const { mutate: startLiveClassMutation } = useStartLiveClass();
  const selectedProgram = watch("programId");
  const selectedBatch = watch("batchId");
  const { data: subjectsData } = useGetSubjects(selectedProgram);
  const subjects = subjectsData?.subjects || [];
  const subjectDataOptions = mapToLabelValue(subjects, "name", "id") || [];

  const filteredPrograms = programOptions.filter((program) =>
    program.label
      .toLowerCase()
      .includes(programSearch.toLowerCase())
  );

  const filteredSubjects = subjectDataOptions.filter((subject) =>
    subject.label
      .toLowerCase()
      .includes(subjectSearch.toLowerCase())
  );

  const filteredTeachers = teachersOptions.filter((teacher) =>
    teacher.label
      .toLowerCase()
      .includes(teacherSearch.toLowerCase())
  );

  const { data: batchesData } = useGetBatches(selectedProgram);
  const batches = batchesData?.batches || [];
  const batchOptions = mapToLabelValue(batches, "name", "id") || [];
  const selectedBatchLabel = batches.find((b) => b.id === selectedBatch)?.name;

  useEffect(() => {
    setValue("batchId", null);
  }, [selectedProgram]);

  // useEffect(() => {
  //   if (classDeliveryMode === "REPLAY") {
  //     setValue("durationMinutes", 0);
  //     setValue("replayMaterialId", "");
  //     setValue("deliveryMode", "REPLAY");
  //   } else {
  //     setValue("durationMinutes", 0);
  //   }
  // }, [classDeliveryMode]);

  const onSubmit = async (data: TScheduleLiveClassInput) => {
    startLiveClassMutation(data, {
      onSuccess: (response) => {
        console.log(response);
        queryClient.invalidateQueries({ queryKey: ["live-classes"] });
        sileo.success({
          title: "Class created successfully",
          description: `Your scheduled class "${response.title}" has been created successfully.`,
        })
        onSuccess?.();
      },

      onError: (error: any) => {
        console.error(error);
        sileo.error({
          title: "Failed to Schedule",
          description: error.message || "An error occurred while starting the live class. Please try again.",
        })
      },
    });
  };
  console.log(errors);
  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("Validation Failed", errors);
      })}
      className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto px-1 pb-2"
    >
      <div className={`grid grid-cols-1 ${classDeliveryMode === "REPLAY" ? "sm:grid-cols-2" : "sm:grid-cols-1"} gap-4`}>
        <div className="space-y-1">
          <Label>Class Type <span className="text-destructive">*</span></Label>
          <Select
            onValueChange={(v) => setValue("deliveryMode", v as "LIVE" | "REPLAY")}
            defaultValue="LIVE"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select class type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(DELIVERY_MODE).map((v, _index) => {
                const value = capitalizeEachWord(v)
                return <SelectItem value={v}>{value}</SelectItem>
              })}

            </SelectContent>
          </Select>
          {errors.deliveryMode && (
            <p className="text-xs text-destructive">{errors.deliveryMode.message}</p>
          )}

        </div>

        {classDeliveryMode === "REPLAY" && (
          <div className="space-y-1">
            <Label>Recorded Video <span className="text-destructive">*</span></Label>

            <Select onValueChange={(v) => {
              setValue("replayMaterialId", v)
              const selectedVideo = dataRef.current.find((material: any) => material.id === v)
              if (selectedVideo?.metadata?.durationMs) {
                const durationInMinutes = Math.ceil(selectedVideo.metadata.durationMs / 60000)
                setValue("durationMinutes", durationInMinutes)
              }
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select recorded video" />
              </SelectTrigger>

              <SelectContent>
                {selectedOption.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    <span className="block max-w-62.5 truncate">
                      {v.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.replayMaterialId && (
              <p className="text-xs text-destructive">{errors.replayMaterialId.message}</p>
            )}
          </div>
        )}
      </div>

      {/* TITLE */}
      <div className="space-y-1">
        <Label>Title <span className="text-destructive">*</span></Label>
        <Input {...register("title")} placeholder="e.g. Introduction to Algebra" />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* SUBJECT + PROGRAM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>
            Program <span className="text-destructive">*</span>
          </Label>

          <div ref={programRef} className="relative">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
              onClick={() => {
                setProgramSearchOpen((prev) => !prev);
                setProgramSearch("");
              }}
            >
              <span className="truncate">
                {programOptions.find(
                  (p) => p.value === selectedProgram
                )?.label || "Select program"}
              </span>

              {/* <span className="text-muted-foreground">⌄</span> */}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
            </Button>

            {programSearchOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border bg-background p-2 shadow-lg">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    type="text"
                    value={programSearch}
                    onChange={(e) => setProgramSearch(e.target.value)}
                    placeholder="Search programs..."
                    className="pl-9"
                    autoComplete="off"
                  />
                </div>

                <div className="max-h-52 overflow-y-auto">
                  {filteredPrograms.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No program found.
                    </p>
                  ) : (
                    filteredPrograms.map((program) => (
                      <button
                        key={program.value}
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                        onClick={() => {
                          setValue("programId", program.value, {
                            shouldValidate: true,
                          });

                          setProgramSearchOpen(false);
                          setProgramSearch("");
                          setValue("subjectId", "");
                          setValue("batchId", null);
                          setSubjectSearch("");
                        }}
                      >
                        {program.label}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {errors.programId && (
            <p className="text-xs text-destructive">
              {errors.programId.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label>
            Subject <span className="text-destructive">*</span>
          </Label>

          <div ref={subjectRef} className="relative">
            <Button
              type="button"
              variant="outline"
              disabled={!selectedProgram}
              className="w-full justify-between font-normal"
              onClick={() => {
                setSubjectSearchOpen((prev) => !prev);
                setSubjectSearch("");
              }}
            >
              <span className="truncate">
                {subjectDataOptions.find(
                  (subject) => subject.value === watch("subjectId")
                )?.label ||
                  (!selectedProgram
                    ? "Please select program first"
                    : subjectDataOptions.length > 0
                      ? "Select subject"
                      : "No Subject Found")}
              </span>

              {/* <span className="text-muted-foreground">⌄</span> */}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
            </Button>

            {subjectSearchOpen && selectedProgram && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border bg-background p-2 shadow-lg">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    type="text"
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    placeholder="Search subjects..."
                    className="pl-9"
                    autoComplete="off"
                  />
                </div>

                <div className="max-h-52 overflow-y-auto">
                  {filteredSubjects.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No subject found.
                    </p>
                  ) : (
                    filteredSubjects.map((subject) => (
                      <button
                        key={subject.value}
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                        onClick={() => {
                          setValue("subjectId", subject.value, {
                            shouldValidate: true,
                          });

                          setSubjectSearchOpen(false);
                          setSubjectSearch("");
                        }}
                      >
                        {subject.label}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {errors.subjectId && (
            <p className="text-xs text-destructive">
              {errors.subjectId.message}
            </p>
          )}
        </div>
      </div>

      {/* BATCH */}
      <div className="space-y-1">
        <Label>Batch (optional)</Label>
        <Select
          value={selectedBatch || "__all__"}
          disabled={!selectedProgram}
          onValueChange={(v) => {
            setValue("batchId", v === "__all__" ? null : v)
          }
          }
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
         {errors.batchId && (
            <p className="text-xs text-destructive">{errors.batchId.message}</p>
          )}
      </div>

      {/* TEACHER */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>
            Teacher <span className="text-destructive">*</span>
          </Label>

          <div ref={teacherRef} className="relative">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
              onClick={() => {
                setTeacherSearchOpen((prev) => !prev);
                setTeacherSearch("");
              }}
            >
              <span className="truncate">
                {teachersOptions.find(
                  (teacher) => teacher.value === watch("teacherId")
                )?.label || "Select teacher"}
              </span>

              {/* <span className="text-muted-foreground">⌄</span> */}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
            </Button>

            {teacherSearchOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border bg-background p-2 shadow-lg">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    type="text"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    placeholder="Search teachers..."
                    className="pl-9"
                    autoComplete="off"
                  />
                </div>

                <div className="max-h-52 overflow-y-auto">
                  {filteredTeachers.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No teacher found.
                    </p>
                  ) : (
                    filteredTeachers.map((teacher) => (
                      <button
                        key={teacher.value}
                        type="button"
                        className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                        onClick={() => {
                          setValue("teacherId", teacher.value, {
                            shouldValidate: true,
                          });

                          setTeacherSearchOpen(false);
                          setTeacherSearch("");
                        }}
                      >
                        {teacher.label}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {errors.teacherId && (
            <p className="text-xs text-destructive">
              {errors.teacherId.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label>Duration (minutes) <span className="text-destructive">*</span></Label>
          <Input
            type="number"
            value={durationValue ?? ""}
            {...register("durationMinutes", { valueAsNumber: true })}
          />
           {errors.durationMinutes && (
            <p className="text-xs text-destructive">{errors.durationMinutes.message}</p>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1">
        <Label>Description <span className="text-destructive">*</span></Label>
        <Textarea
          {...register("description")}
          placeholder="Brief about what will be covered..."
          className="resize-none"
          rows={3}
        />
         {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
      </div>

      {/* SCHEDULE TIME */}
      <div className="space-y-1">
        <Label>Schedule date & time</Label>
        <Input
          type="datetime-local"
          onChange={(e) => {
            if (e.target.value) {
              setValue("scheduledAt", new Date(e.target.value).toISOString(), {shouldValidate: true});
            } else {
              setValue("scheduledAt", "" as any);
            }
          }}
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
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={watch("durationMinutes") || ""}
            onChange={(e) => setValue("durationMinutes", Number(e.target.value))}
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