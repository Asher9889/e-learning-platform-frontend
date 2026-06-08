import { Button } from "@/components/ui/button";
import ThemeToggle from "../common/ThemeToggle";
import { useNavigate } from "react-router-dom";

export function PublicHeader() {
  const navigate = useNavigate();
 

  return (
    <header className="sticky top-0 z-50 border-b-6 border-border backdrop-blur-md bg-background/80 flex items-center justify-center h-16 px-10">
      <div className="mx-auto w-full max-w-[1100px] flex h-16 items-center justify-between">

        {/* Logo */}
        <div className="font-['Syne',_sans-serif] font-extrabold text-[22px] bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent tracking-[-0.5px]">
          E-Learning
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-[14px] text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#classroom" className="hover:text-foreground transition-colors">Live Classes</a>
          <a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a>
          <a href="#security" className="hover:text-foreground transition-colors">Security</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3.5">
          <ThemeToggle />

          <Button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white border-none px-[22px] py-[9px] rounded-full text-[14px] font-medium transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(37,99,235,0.4)]"
          >
            Get Started
          </Button>
        </div>

      </div>
    </header>
  );
}