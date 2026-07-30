import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-lg border-border shadow-lg">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            404
          </h1>

          <h2 className="mt-4 text-2xl font-semibold">
            Page Not Found
          </h2>

          <p className="mt-3 max-w-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist, has been moved,
            or you don&apos;t have permission to access it.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}