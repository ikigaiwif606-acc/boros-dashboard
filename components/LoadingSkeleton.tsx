export function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-4">
          <div className="h-6 w-16 rounded bg-[#1e2030]" />
          <div className="h-6 w-24 rounded bg-[#1e2030]" />
          <div className="h-6 w-24 rounded bg-[#1e2030]" />
          <div className="h-6 w-20 rounded bg-[#1e2030]" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[#1e2030] bg-[#12131a] p-5">
      <div className="mb-3 h-5 w-40 rounded bg-[#1e2030]" />
      <div className="mb-2 h-8 w-24 rounded bg-[#1e2030]" />
      <div className="mb-2 h-4 w-32 rounded bg-[#1e2030]" />
      <div className="h-4 w-28 rounded bg-[#1e2030]" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[#1e2030] bg-[#12131a] p-5">
      <div className="mb-4 flex gap-2">
        <div className="h-8 w-12 rounded bg-[#1e2030]" />
        <div className="h-8 w-12 rounded bg-[#1e2030]" />
      </div>
      <div className="h-64 w-full rounded bg-[#1e2030]" />
    </div>
  );
}
