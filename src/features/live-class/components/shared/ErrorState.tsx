import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  statusCode?: number
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
  statusCode
}: ErrorStateProps) {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message}</p>
      {  onRetry  && (
        <Button variant="outline" size="sm" className="mt-4" onClick={() => {
          if(statusCode !==  409  ){
          onRetry();
          }else{
            navigate(-1);
          }
          }}>
          {statusCode !==  409 && <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
          {statusCode !==  409  ? "Try again" : "Go back"}
        </Button>
      )}
    </div>
  );
}
