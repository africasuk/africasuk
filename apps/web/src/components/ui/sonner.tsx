"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircle2, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react"

export default function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      /* Force explicit light-mode theme targeting to fit your single-canvas brand rules */
      theme="light"
      className="toaster group font-sans antialiased"
      gap={8}
      icons={{
        success: (
          <CheckCircle2 className="size-4.5 text-[#004d26] shrink-0" />
        ),
        info: (
          <Info className="size-4.5 text-neutral-600 shrink-0" />
        ),
        warning: (
          <AlertTriangle className="size-4.5 text-amber-600 shrink-0" />
        ),
        error: (
          <XCircle className="size-4.5 text-rose-600 shrink-0" />
        ),
        loading: (
          <Loader2 className="size-4.5 text-[#004d26] animate-spin shrink-0" />
        ),
      }}
      toastOptions={{
        className: "bg-white border border-neutral-200/60 text-neutral-800 shadow-xl rounded-xl p-4 select-none",
        classNames: {
          toast: "group-[.toaster]:bg-white group-[.toaster]:text-neutral-800 group-[.toaster]:border-neutral-200/50 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          title: "text-[13px] font-bold tracking-wide text-neutral-900 leading-snug",
          description: "text-[11px] font-medium text-neutral-500 leading-normal",
          
          /* Custom style overrides for specific toast actions */
          success: "group-[.toast]:border-[#004d26]/20 group-[.toast]:bg-gradient-to-r group-[.toast]:from-white group-[.toast]:to-[#004d26]/[0.02]",
          error: "group-[.toast]:border-rose-200/60 group-[.toast]:bg-gradient-to-r group-[.toast]:from-white group-[.toast]:to-rose-50/[0.02]",
          
          actionButton: "group-[.toast]:bg-[#004d26] group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:text-xs group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:h-8 group-[.toast]:transition-colors group-[.toast]:hover:bg-[#003b1d]",
          cancelButton: "group-[.toast]:bg-neutral-100 group-[.toast]:text-neutral-700 group-[.toast]:font-semibold group-[.toast]:text-xs group-[.toast]:rounded-lg"
        },
      }}
      {...props}
    />
  )
}

export { Toaster }