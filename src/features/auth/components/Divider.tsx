export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-xs text-stone">
      <span className="h-px flex-1 bg-bone" />
      {label}
      <span className="h-px flex-1 bg-bone" />
    </div>
  )
}