
import Link from "next/link";


import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/auth/LogoutButton";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold">
        Access Denied
      </h1>

      <p className="max-w-md text-muted-foreground">
        You do not have permission to
        access this page.
      </p>

      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">
            Back to Dashboard
          </Link>
        </Button>

        <LogoutButton />
      </div>
    </div>
  );
}