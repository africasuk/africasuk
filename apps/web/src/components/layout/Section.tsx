import { cn } from "lib/utils";
import type { ReactNode } from "react";



interface SectionProps {
  children: ReactNode;
  className?: string;
}

export default function Section({
  children,
  className,
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-8 md:py-12 lg:py-16",
        className
      )}
    >
      {children}
    </section>
  );
}