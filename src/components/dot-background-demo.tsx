import { cn } from "@/lib/utils";
import React from "react";

export default function DotBackgroundDemo({ children }: { children?: React.ReactNode }) {
  return (
    // Yahan background color add karein (e.g., bg-[#1e2a5e])
    <div className="relative h-full w-full bg-[#1e2a5e]">
      
      {/* DOT GRID LAYER - Yeh background ke upar rahega */}
      <div
        className={cn(
          "absolute inset-0 z-[1]",
          "[background-size:30px_30px]",
          "[background-image:radial-gradient(rgba(255,255,255,0.3)_1.5px,transparent_1.5px)]"
        )}
      />
      
      {/* MASK LAYER - Yeh dots ko fade effect dega (z-2) */}
      {/* 'ellipse_at_center,transparent_10%,black' ka matlab hai center 10% gayab hoga */}
      <div 
        className="pointer-events-none absolute inset-0 z-[2] bg-[#1e2a5e] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" 
      />

      {/* CONTENT LAYER - Aapka Login/Register form (z-3) */}
      <div className="relative z-[3] h-full w-full">
        {children}
      </div>
    </div>
  );
}