import { FileQuestion } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function EmptyPreviewState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/30">
          <FileQuestion className="size-10 text-indigo-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          No assessment generated yet
        </h3>
        <p className="max-w-xs text-center text-sm text-muted-foreground">
          Configure your settings on the left and click{" "}
          <span className="font-medium text-indigo-500">Generate Assessment</span>{" "}
          to see a preview here.
        </p>
      </CardContent>
    </Card>
  )
}
