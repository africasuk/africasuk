"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Terminal, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Session terminated");
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-300 font-mono selection:bg-rose-500/30 selection:text-rose-400">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-size-[2rem_2rem] pointer-events-none" />

      <Card className="relative w-full max-w-md border-zinc-800 bg-zinc-900/90 backdrop-blur-sm shadow-2xl shadow-black/80 text-zinc-300">
        <CardContent className="flex flex-col items-center py-8 text-center">
          {/* Diagnostic Header */}
          <div className="w-full border-b border-zinc-800/80 pb-4 mb-6 flex items-center justify-between text-xs text-zinc-500 font-sans tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              ERR_SCOPE_MISMATCH
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-zinc-500" /> SYS_ERR_403
            </span>
          </div>

          <AlertTriangle className="mb-4 h-12 w-12 text-rose-500/90 stroke-[1.5]" />

          <h1 className="text-sm font-semibold tracking-wider text-zinc-100 uppercase">
            Exception: Access Violation
          </h1>

          <p className="mt-2 text-xs text-zinc-400 font-mono leading-relaxed max-w-xs">
            Telemetry token lacks required system runtime capabilities for this node environment.
          </p>

          <Button
            variant="destructive"
            className="mt-6 bg-rose-950/80 hover:bg-rose-900/90 text-rose-200 border border-rose-800/60 font-mono text-xs tracking-wider uppercase transition-all duration-200"
            onClick={handleLogout}
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Terminate Session & Flush Cache
          </Button>

          {/* Fake Stack Trace / Log footer */}
          <div className="mt-8 pt-4 w-full border-t border-zinc-800/60 text-[10px] text-zinc-600 font-mono text-left space-y-1">
            <p>&gt; Process ID: 10482</p>
            <p>&gt; Status: RBAC_ENFORCED</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}