import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Slider } from "radix-ui"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import AssessmentTypeSelector from "./AssessmentTypeSelector"
import DifficultySelector from "./DifficultySelector"
import {
  assessmentFormSchema,
  type AssessmentFormData,
} from "../schemas/assessment.schema"
import {
  QUESTION_TYPE_OPTIONS,
} from "../types/assessment.types"
import { useGetPrograms } from "@/pages/Programs/hooks/useGetPrograms"
import { useGetSubjects } from "@/pages/Subjects/hooks/useGetSubjects"
import { Sparkles } from "lucide-react"

interface AssessmentGeneratorFormProps {
  onSubmit: (data: AssessmentFormData) => void
  isGenerating: boolean
}

export default function AssessmentGeneratorForm({
  onSubmit,
  isGenerating,
}: AssessmentGeneratorFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AssessmentFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(assessmentFormSchema) as unknown as Resolver<AssessmentFormData, any>,
    defaultValues: {
      assessmentType: "QUIZ",
      programId: "",
      subject: "",
      topic: "",
      difficulty: "MIXED",
      questionTypes: ["MCQ"],
      questionCount: 10,
      totalMarks: 50,
      additionalInstructions: "",
    },
  })

  const questionCount = watch("questionCount")
  const assessmentType = watch("assessmentType")
  const difficulty = watch("difficulty")
  const questionTypes = watch("questionTypes")
  const programId = watch("programId")
  const requiredError = "text-xs text-destructive-foreground text-red-500";

  const { data: programsData, isLoading: programsLoading } = useGetPrograms()
  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjects(programId || undefined)

  const programs = programsData?.programs ?? []
  const subjects = subjectsData?.subjects ?? []

  const handleFormSubmit = (data: AssessmentFormData) => {
    console.log("Form Data:", data)
    // onSubmit(data)
  } 


  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Settings</CardTitle>
        <CardDescription>
          Tell AI what kind of assessment you want to create.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div className="space-y-2">
            <AssessmentTypeSelector
              value={assessmentType}
              onValueChange={(v) => setValue("assessmentType", v, { shouldValidate: true })}
              error={errors.assessmentType?.message}
            />
          </div>

          {/* Program Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Program</label>
            <Select
              value={programId}
              onValueChange={(v) => {
                setValue("programId", v, { shouldValidate: true })
                setValue("subject", "", { shouldValidate: true })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={programsLoading ? "Loading programs..." : "Select a program"} />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.programId && (
              <p className={requiredError}>{errors.programId.message}</p>
            )}
          </div>

          {/* Subject Selection - dependent on selected program */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Select
              value={watch("subject")}
              onValueChange={(v) => setValue("subject", v, { shouldValidate: true })}
              disabled={!programId || subjectsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={
                  !programId
                    ? "Select a program first"
                    : subjectsLoading
                      ? "Loading subjects..."
                      : "Select a subject"
                } />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className={requiredError}>{errors.subject.message}</p>
            )}
          </div>

           {/* Topic */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <Input
              placeholder="e.g. Linear Equations, World War II, Photosynthesis"
              {...register("topic")}
            />
            {errors.topic && (
              <p className={requiredError}>{errors.topic.message}</p>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <DifficultySelector
              value={difficulty}
              onValueChange={(v) => setValue("difficulty", v, { shouldValidate: true })}
            />
          </div>

          {/* Question Types */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Types</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {QUESTION_TYPE_OPTIONS.map(({ value, label }) => {
                const isChecked = questionTypes.includes(value)
                return (
                  <label
                    key={value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm transition-all",
                      isChecked
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/30 dark:text-indigo-300"
                        : "border-border bg-card text-muted-foreground hover:border-indigo-200 hover:bg-indigo-50/50 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValue("questionTypes", [ value], { shouldValidate: true })
                        } else {
                          setValue(
                            "questionTypes",
                            questionTypes.filter((v) => v !== value),
                            { shouldValidate: true }
                          )
                        }
                      }}
                      className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                    />
                    {label}
                  </label>
                )
              })}
            </div>
            {errors.questionTypes && (
              <p className={requiredError}>{errors.questionTypes.message}</p>
            )}
          </div>

          {/* Question Count */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Count</label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">5</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {questionCount}
                </span>
                <span className="text-xs text-muted-foreground">50</span>
              </div>
              <Slider.Root
                value={[questionCount]}
                onValueChange={(v: number[]) => setValue("questionCount", v[0], { shouldValidate: true })}
                min={5}
                max={50}
                step={1}
                className="relative flex h-5 w-full touch-none items-center"
              >
                <Slider.Track className="relative h-2 grow rounded-full bg-muted">
                  <Slider.Range className="absolute h-full rounded-full bg-linear-to-r from-indigo-400 to-indigo-600" />
                </Slider.Track>
                <Slider.Thumb className="block size-5 cursor-pointer rounded-full border-2 border-indigo-500 bg-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 hover:border-indigo-600" />
              </Slider.Root>
            </div>
            {errors.questionCount && (
              <p className={requiredError}>{errors.questionCount.message}</p>
            )}
          </div>

          {/* Total Marks */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Marks</label>
            <Input
              type="number"
              placeholder="e.g. 50, 75, 100"
              {...register("totalMarks", { valueAsNumber: true })}
            />
            {errors.totalMarks && (
              <p className="text-xs text-destructive-foreground">{errors.totalMarks.message}</p>
            )}
          </div>

          {/* Additional Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt</label>
            <Textarea
              placeholder="Provide any additional context for the assessment generation."
              className="min-h-20 resize-none"
              {...register("additionalInstructions")}
            />
            {errors.additionalInstructions && (
              <p className={requiredError}>{errors.additionalInstructions.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isGenerating}
            onClick={handleSubmit(handleFormSubmit)}
            size="lg"
            className="w-full bg-linear-to-r from-indigo-500 to-indigo-600 text-white shadow-md transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg disabled:opacity-60"
          >
            <Sparkles className="size-4" />
            {isGenerating ? "Generating..." : "Generate Assessment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
