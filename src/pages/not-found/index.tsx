import { Button } from "@/components/ui/button";
import { PATHS } from "@/routes";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="space-y-4">
        <h1 className="text-7xl font-extrabold tracking-tight">
          404
        </h1>

        <h2 className="text-2xl font-semibold">
          Page Not Found
        </h2>

        <p className="max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <Button asChild>
            <Link to={PATHS.HOME}>
              Go Home
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}