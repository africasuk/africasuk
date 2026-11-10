"use client";

import { useTranslation } from "@/components/providers/LanguageProvider";

export default function Copyright() {
  const { dictionary } = useTranslation();

  return (
    <div className="border-t py-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Africa Suk.{" "}
      {dictionary.common.copyright}
    </div>
  );
}