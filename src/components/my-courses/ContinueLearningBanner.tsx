import { Button } from "@/components/ui/button";

export function ContinueLearningBanner({
  course,
}: any) {
  if (!course) return null;

  return (
    <div className="p-4 border rounded-xl flex justify-between items-center">
      <div>
        <h2 className="font-semibold">
          Continue Learning
        </h2>

        <p className="text-sm text-muted-foreground">
          {course.title} —{" "}
          {course.progress}% completed
        </p>
      </div>

      <Button>Continue</Button>
    </div>
  );
}