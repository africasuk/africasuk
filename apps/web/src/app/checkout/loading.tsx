export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl p-10">
      <div className="h-10 w-64 animate-pulse rounded bg-muted" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="h-72 animate-pulse rounded-xl bg-muted" />
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        </div>

        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}