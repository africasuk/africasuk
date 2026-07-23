import type { ReactNode } from "react";

import { cn } from "lib/utils";

interface ContainerProps {
  children: ReactNode;

  className?: string;

  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizes = {
  sm: "max-w-5xl",
  md: "max-w-6xl",
  lg: "max-w-7xl",
  xl: "max-w-screen-2xl",
  full: "max-w-full",
};

export default function Container({
  children,
  className,
  size = "xl",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10",
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  );
}