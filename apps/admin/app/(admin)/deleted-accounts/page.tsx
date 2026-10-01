import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  Calendar,
  Mail,
  ShieldAlert,
  UserX,
} from "lucide-react";

export default async function DeletedAccountsPage() {
  const supabase = createAdminSupabaseClient();

  const { data: accounts, error } = await supabase
    .from("deleted_accounts")
    .select(
      "id, user_id, email, deletion_reason, deleted_at, deleted_by, ip_address, user_agent",
    )
    .order("deleted_at", { ascending: false });

  if (error) {
    console.error("Deleted accounts error:", error);
  }

  const deletedAccounts = accounts ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UserX className="size-5 text-red-600 dark:text-red-400" />

            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Deleted Accounts
            </h1>
          </div>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Audit history of accounts deleted from AfricaSuk.
          </p>
        </div>

        <div className="border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Total Deleted
          </p>

          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {deletedAccounts.length}
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />

        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Account deletion audit
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
            These records are retained for security, fraud prevention,
            disputes, and account-deletion auditing.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        {deletedAccounts.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center p-8 text-center">
            <UserX className="size-8 text-zinc-300 dark:text-zinc-700" />

            <h2 className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              No deleted accounts
            </h2>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Deleted account records will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Account
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Deleted
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Deleted By
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    IP Address
                  </th>

                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Reason
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {deletedAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
                          <Mail className="size-4 text-red-600 dark:text-red-400" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {account.email || "Unknown email"}
                          </p>

                          <p className="mt-0.5 max-w-70 truncate font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                            {account.user_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-zinc-400 dark:text-zinc-500" />

                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                          {new Date(account.deleted_at).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                        {account.deleted_by || "user"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {account.ip_address || "—"}
                      </span>
                    </td>

                    <td className="max-w-55 px-5 py-4">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {account.deletion_reason || "No reason provided"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}