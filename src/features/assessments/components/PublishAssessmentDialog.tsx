// import { useState } from "react"
// import { useGetBatches } from "@/pages/Batches/hooks/useGetBatches"
// import { mapToLabelValue } from "@/lib/utils"

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Users, Loader2, Send } from "lucide-react"
// import { usePublishAssessment } from "../hooks/usePublishAssessment"
// import type { Question } from "../types/assessment.types"
// import type { AssessmentFormData } from "../schemas/assessment.schema"

// interface Props {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   config: AssessmentFormData
//   questions: Question[]
//   title: string
//   instructions: string
//   assessmentResult: {
//     questions: Question[]
//     summary: { totalQuestions: number; totalMarks: number; estimatedMinutes: number }
//   }
//   onPublished?: () => void
// }

// export default function PublishAssessmentDialog({
//   open,
//   onOpenChange,
//   config,
//   questions,
//   title,
//   instructions,
//   assessmentResult,
//   onPublished,
// }: Props) {
//   const [batchId, setBatchId] = useState("")

//   const { data: batchesData, isLoading: batchesLoading } = useGetBatches(config.programId)
//   const batches = batchesData?.batches || []
//   const batchOptions = mapToLabelValue(batches, "name", "id")
//   const selectedBatchLabel = batches.find((b) => b.id === batchId)?.name

//   const { mutate: publish, isPending: isPublishing } = usePublishAssessment()

//   const handlePublish = () => {
//     publish(
//       {
//         title,
//         instructions,
//         assessmentType: config.assessmentType,
//         programId: config.programId,
//         subjectId: config.subjectId,
//         topic: config.topic,
//         difficulty: config.difficulty,
//         questionTypes: config.questionTypes,
//         questionCount: config.questionCount,
//         totalMarks: config.totalMarks || assessmentResult.summary.totalMarks,
//         additionalInstructions: config.additionalInstructions,
//         questions,
//         batchId: batchId || undefined,
//         allStudents: !batchId,
//       },
//       {
//         onSuccess: () => {
//           onOpenChange(false)
//           setBatchId("")
//           onPublished?.()
//         },
//       }
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Publish Assessment</DialogTitle>
//           <DialogDescription>
//             Choose the audience for this assessment before publishing.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-2">
//           <div className="space-y-1">
//             <label className="text-sm font-medium">Batch (optional)</label>
//             <Select
//               value={batchId || "__all__"}
//               disabled={batchesLoading}
//               onValueChange={(v) => setBatchId(v === "__all__" ? "" : v)}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue
//                   placeholder={
//                     batchesLoading
//                       ? "Loading batches..."
//                       : "All students in this program"
//                   }
//                 />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="__all__">All students in this program</SelectItem>
//                 {batchOptions.map((b) => (
//                   <SelectItem key={b.value} value={b.value}>
//                     {b.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <div className="flex items-start gap-2 mt-1.5">
//               <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
//               <p className="text-xs text-muted-foreground">
//                 {!batchId
//                   ? "All students enrolled in this program can access this assessment."
//                   : `Only students in the "${selectedBatchLabel}" batch can access this assessment.`}
//               </p>
//             </div>
//           </div>

//           <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
//             <p className="text-xs font-medium text-muted-foreground">Assessment summary</p>
//             <div className="flex gap-4 text-sm">
//               <span>{assessmentResult.summary.totalQuestions} questions</span>
//               <span>{assessmentResult.summary.totalMarks} marks</span>
//               <span>~{assessmentResult.summary.estimatedMinutes} min</span>
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPublishing}>
//             Cancel
//           </Button>
//           <Button onClick={handlePublish} disabled={isPublishing} className="gap-2">
//             {isPublishing ? (
//               <Loader2 className="size-4 animate-spin" />
//             ) : (
//               <Send className="size-4" />
//             )}
//             {isPublishing ? "Publishing..." : "Publish"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }



// import { useState } from "react"
// import { Users, Loader2, Send } from "lucide-react"

// import { useGetBatches } from "@/pages/Batches/hooks/useGetBatches"
// import { usePublishAssessment } from "../hooks/usePublishAssessment"

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"

// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"

// import {
//   RadioGroup,
//   RadioGroupItem,
// } from "@/components/ui/radio-group"

// import type { Question } from "../types/assessment.types"
// import type { AssessmentFormData } from "../schemas/assessment.schema"

// interface Batch {
//   id: string
//   name: string
// }

// interface AssessmentSummary {
//   totalQuestions: number
//   totalMarks: number
//   estimatedMinutes: number
// }

// interface AssessmentResult {
//   questions: Question[]
//   summary: AssessmentSummary
// }

// interface Props {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   config: AssessmentFormData
//   questions: Question[]
//   title: string
//   instructions: string
//   assessmentResult: AssessmentResult
//   onPublished?: () => void
// }

// type TargetType = "ALL" | "BATCHES"

// export default function PublishAssessmentDialog({
//   open,
//   onOpenChange,
//   config,
//   questions,
//   title,
//   instructions,
//   assessmentResult,
//   onPublished,
// }: Props) {
//   const [targetType, setTargetType] =
//     useState<TargetType>("ALL")

//   const [selectedBatchIds, setSelectedBatchIds] =
//     useState<string[]>([])

//   const {
//     data: batchesData,
//     isLoading: batchesLoading,
//   } = useGetBatches(config.programId)

//   const batches: Batch[] =
//     (batchesData?.batches as Batch[]) ?? []

//   const {
//     mutate: publish,
//     isPending: isPublishing,
//   } = usePublishAssessment()

//   const toggleBatch = (batchId: string) => {
//     setSelectedBatchIds((prev) =>
//       prev.includes(batchId)
//         ? prev.filter((id) => id !== batchId)
//         : [...prev, batchId]
//     )
//   }

//   const handlePublish = () => {
//     publish(
//       {
//         title,
//         instructions,

//         assessmentType: config.assessmentType,
//         programId: config.programId,
//         subjectId: config.subjectId,

//         topic: config.topic,
//         difficulty: config.difficulty,
//         questionTypes: config.questionTypes,
//         questionCount: config.questionCount,

//         totalMarks:
//           config.totalMarks ||
//           assessmentResult.summary.totalMarks,

//         additionalInstructions:
//           config.additionalInstructions,

//         questions,

//         batchIds:
//           targetType === "ALL"
//             ? null
//             : selectedBatchIds,
//       },
//       {
//         onSuccess: () => {
//           onOpenChange(false)

//           setTargetType("ALL")
//           setSelectedBatchIds([])

//           onPublished?.()
//         },
//       }
//     )
//   }

//   const selectedBatchNames = batches
//     .filter((batch) =>
//       selectedBatchIds.includes(batch.id)
//     )
//     .map((batch) => batch.name)

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={onOpenChange}
//     >
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle>
//             Publish Assessment
//           </DialogTitle>

//           <DialogDescription>
//             Choose who can access this
//             assessment before publishing.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 py-2">
//           <div className="space-y-3">
//             <Label>Audience</Label>

//             {/* <RadioGroup
//               value={targetType}
//               onValueChange={(value) =>
//                 setTargetType(value as TargetType)
//               }
//             >
//               <div className="flex items-center gap-2">
//                 <RadioGroupItem
//                   value="ALL"
//                   id="all-students"
//                 />
//                 <Label htmlFor="all-students">
//                   All Students
//                 </Label>
//               </div>

//               <div className="flex items-center gap-2">
//                 <RadioGroupItem
//                   value="BATCHES"
//                   id="selected-batches"
//                 />
//                 <Label htmlFor="selected-batches">
//                   Selected Batches
//                 </Label>
//               </div>
//             </RadioGroup> */}
//             <RadioGroup
//               value={targetType}
//               onValueChange={(value) =>
//                 setTargetType(value as "ALL" | "BATCHES")
//               }
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="ALL" id="all" />
//                 <Label htmlFor="all">All Students</Label>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="BATCHES" id="batches" />
//                 <Label htmlFor="batches">Selected Batches</Label>
//               </div>
//             </RadioGroup>
//           </div>

//           {targetType === "BATCHES" && (
//             <div className="space-y-3">
//               <Label>Select Batches</Label>

//               <div className="max-h-60 overflow-y-auto rounded-md border p-3">
//                 {batchesLoading ? (
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Loading batches...
//                   </div>
//                 ) : batches.length === 0 ? (
//                   <p className="text-sm text-muted-foreground">
//                     No batches found
//                   </p>
//                 ) : (
//                   <div className="space-y-2">
//                     {batches.map((batch) => (
//                       <label
//                         key={batch.id}
//                         className="flex items-center gap-2 cursor-pointer"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selectedBatchIds.includes(
//                             batch.id
//                           )}
//                           onChange={() =>
//                             toggleBatch(batch.id)
//                           }
//                         />

//                         <span className="text-sm">
//                           {batch.name}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           <div className="rounded-lg border bg-muted/30 p-4">
//             <div className="flex items-start gap-2">
//               <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />

//               <div className="space-y-1">
//                 <p className="text-sm font-medium">
//                   Audience Summary
//                 </p>

//                 {targetType === "ALL" ? (
//                   <p className="text-xs text-muted-foreground">
//                     This assessment will be
//                     available to all students in
//                     this program.
//                   </p>
//                 ) : (
//                   <p className="text-xs text-muted-foreground">
//                     {selectedBatchNames.length > 0
//                       ? `Available to: ${selectedBatchNames.join(
//                         ", "
//                       )}`
//                       : "No batch selected."}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="rounded-lg border bg-muted/30 p-4">
//             <p className="mb-2 text-sm font-medium">
//               Assessment Summary
//             </p>

//             <div className="flex flex-wrap gap-4 text-sm">
//               <span>
//                 {
//                   assessmentResult.summary
//                     .totalQuestions
//                 }{" "}
//                 Questions
//               </span>

//               <span>
//                 {
//                   assessmentResult.summary
//                     .totalMarks
//                 }{" "}
//                 Marks
//               </span>

//               <span>
//                 ~
//                 {
//                   assessmentResult.summary
//                     .estimatedMinutes
//                 }
//                 min
//               </span>
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={() =>
//               onOpenChange(false)
//             }
//             disabled={isPublishing}
//           >
//             Cancel
//           </Button>

//           <Button
//             onClick={handlePublish}
//             disabled={
//               isPublishing ||
//               (targetType === "BATCHES" &&
//                 selectedBatchIds.length === 0)
//             }
//             className="gap-2"
//           >
//             {isPublishing ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Publishing...
//               </>
//             ) : (
//               <>
//                 <Send className="h-4 w-4" />
//                 Publish Assessment
//               </>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }




import * as React from "react"
import { useState } from "react"
import { useGetBatches } from "@/pages/Batches/hooks/useGetBatches"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  // useComboboxAnchor,
} from "@/components/ui/combobox"

import {
  Users,
  Loader2,
  Send,
} from "lucide-react"

import { usePublishAssessment } from "../hooks/usePublishAssessment"

import type { Question } from "../types/assessment.types"
import type { AssessmentFormData } from "../schemas/assessment.schema"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: AssessmentFormData
  questions: Question[]
  title: string
  instructions: string
  assessmentResult: {
    questions: Question[]
    summary: {
      totalQuestions: number
      totalMarks: number
      estimatedMinutes: number
    }
  }
  onPublished?: () => void
}

type BatchOption = {
  label: string
  value: string
}

export default function PublishAssessmentDialog({
  open,
  onOpenChange,
  config,
  questions,
  title,
  instructions,
  assessmentResult,
  onPublished,
}: Props) {
  // const anchor = useComboboxAnchor()
  const dialogContentRef = React.useRef<HTMLDivElement>(null)
  // Ab hum poori batch object ko select karte hain (label + value),
  // sirf ids ka array nahi rakhte — isse chips display ke liye
  // naam bhi turant available rehta hai.
  const [selectedBatches, setSelectedBatches] = useState<BatchOption[]>([])
  console.log(config, "config21321321")
  const { data: batchesData } = useGetBatches(config.programId)

  const batches: BatchOption[] = (batchesData?.batches || []).map((b) => ({
    label: b.name,
    value: b.id,
  }))

  const { mutate: publish, isPending: isPublishing } = usePublishAssessment()

  // API ko bhejne ke liye sirf ids chahiye — yahan se derive kar liya
  const batchIds = selectedBatches.map((b) => b.value)
  console.log(selectedBatches, "selectedBatchesselectedBatchesselectedBatches")
  const handlePublish = () => {

    console.log({
        title,
        instructions,
        assessmentType: config.assessmentType,
        programId: config.programId,
        subjectId: config.subjectId,
        topic: config.topic,
        difficulty: config.difficulty,
        questionTypes: config.questionTypes,
        questionCount: config.questionCount,
        totalMarks:
          config.totalMarks ||
          assessmentResult?.summary?.totalMarks ,
        additionalInstructions:
          config.additionalInstructions,
        questions,

        // [] => all students
        // ["id1"] => single batch
        // ["id1","id2"] => multiple batches
        batchId:
        batchIds,
      },"publish data")
    publish(
      {
        title,
        instructions,
        assessmentType: config.assessmentType,
        programId: config.programId,
        subjectId: config.subjectId,
        topic: config.topic,
        difficulty: config.difficulty,
        questionTypes: config.questionTypes,
        questionCount: config.questionCount,
        totalMarks:
          config.totalMarks ||
          assessmentResult.summary.totalMarks,
        additionalInstructions:
          config.additionalInstructions,
        questions,

        // [] => all students
        // ["id1"] => single batch
        // ["id1","id2"] => multiple batches
        batchId : batchIds,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setSelectedBatches([])
          onPublished?.()
        },
      }
    )
  }
  console.log(batches, "batches151231321")
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent ref={dialogContentRef} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Publish Assessment
          </DialogTitle>

          <DialogDescription>
            Choose who can access this
            assessment before publishing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Batches (optional)
            </label>
            {/* 
            <Combobox
              multiple
              items={batches}
              value={selectedBatches}
              onValueChange={setSelectedBatches}
              itemToStringValue={(batch: BatchOption) => batch.label}  
            >
              <ComboboxChips>
                <ComboboxValue>
                  {selectedBatches.map((item) => (
                    <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
                  ))}
                </ComboboxValue>
                <ComboboxChipsInput placeholder="Add framework" />
              </ComboboxChips>
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item?.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox> */}

            <Combobox
              multiple

              items={batches}
              value={selectedBatches}
              onValueChange={setSelectedBatches}
              itemToStringValue={(batch: BatchOption) => batch.label}
              isItemEqualToValue={(item: BatchOption, value: BatchOption) => item.value === value.value}
            >
              <ComboboxChips>
                <ComboboxValue>
                  {selectedBatches.map((item) => (
                    <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
                  ))}
                </ComboboxValue>
                <ComboboxChipsInput placeholder="Add batch" />
              </ComboboxChips>
              <ComboboxContent container={dialogContentRef}  >
                <div className="border-b p-1">
                  <button
                    type="button"
                    className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
                    onClick={() => {
                      setSelectedBatches(
                        selectedBatches.length === batches.length ? [] : batches
                      )
                    }}
                  >
                    {selectedBatches.length === batches.length ? "Deselect All" : "Select All Batches"}
                  </button>
                </div>

                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList >
                  {(item: BatchOption) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item?.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <div className="flex items-start gap-2 mt-2">
              <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />

              <p className="text-xs text-muted-foreground">
                {selectedBatches.length === 0
                  ? "All students enrolled in this program can access this assessment."
                  : `Available only for: ${selectedBatches
                    .map((b) => b.label)
                    .join(", ")}`}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Assessment summary
            </p>

            <div className="flex gap-4 text-sm">
              <span>
                {
                  assessmentResult?.summary
                    ?.totalQuestions  
                }{" "}
                questions
              </span>

              <span>
                {
                  assessmentResult?.summary
                    ?.totalMarks 
                }{" "}
                marks
              </span>

              <span>
                ~
                {
                  assessmentResult?.summary
                    ?.estimatedMinutes
                }
                min
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={isPublishing}
          >
            Cancel
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="gap-2"
          >
            {isPublishing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}

            {isPublishing
              ? "Publishing..."
              : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}