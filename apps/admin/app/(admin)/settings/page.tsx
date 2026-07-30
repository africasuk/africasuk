import Link from "next/link";

import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const settings = [
  {
    title: "Currency Settings",
    description: "Manage the USD to SSP exchange rate.",
    href: "/settings/currency",
  },
  {
    title: "General Settings",
    description: "Configure application-wide settings.",
    href: "/settings/general",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application settings."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {settings.map((setting) => (
          <Card key={setting.href}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {setting.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>

              <Button asChild>
                <Link href={setting.href}>
                  Open
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}