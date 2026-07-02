import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RightSidebarProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function RightSidebar({
  open,
  title,
  onClose,
  children,
}: RightSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop — only really matters on small screens where sidebar
              covers more of the board, but harmless on desktop too */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 bg-black/20 sm:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute right-0 top-0 z-30 h-full w-full sm:w-[360px] border-l bg-background shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b p-4 shrink-0">
              <h2 className="font-semibold capitalize">{title}</h2>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 min-h-0">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}