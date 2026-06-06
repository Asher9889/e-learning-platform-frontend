import React from "react";
import useInView from "../../hooks/useInView";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedSection({
  children,
  className,
}: Props) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}