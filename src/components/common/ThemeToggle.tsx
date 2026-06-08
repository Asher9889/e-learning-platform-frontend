import { Moon, Sun } from "lucide-react";
import { useTheme } from "#hooks/use-theme";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-8 h-8 flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
    >
      <Sun
        className={cn(
          "absolute h-[18px] w-[18px] text-amber-400 transition-all duration-300",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        )}
      />
      <Moon
        className={cn(
          "absolute h-[18px] w-[18px] text-indigo-400 transition-all duration-300",
          isDark ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        )}
      />
    </Button>
  );
}