import type { ReactNode } from "react";

interface LiveClassSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

const LiveClassSection = ({
  title,
  description,
  action,
  children,
}: LiveClassSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
};

export default LiveClassSection;