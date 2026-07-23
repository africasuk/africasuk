"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PageHeaderAction {
  label: string;
  href: string;
  icon?: React.ReactNode;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: PageHeaderAction[];
}

export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      {/* Text Section */}
      <div className="space-y-1 min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl wrap-break-word">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-muted-foreground wrap-break-word">
            {description}
          </p>
        )}
      </div>

      {/* Actions Section */}
      {actions && actions.length > 0 && (
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          {actions.map((action) => (
            <Button
              key={action.href}
              variant={action.variant ?? "default"}
              asChild
              className="w-full sm:w-auto"
            >
              <Link href={action.href} className="flex items-center justify-center gap-2">
                {action.icon ?? <Plus className="h-4 w-4" />}
                <span>{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}