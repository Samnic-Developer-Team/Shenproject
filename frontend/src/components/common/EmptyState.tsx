export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-3xl border border-outline-variant/20 bg-white p-8 shadow-sm"><h3 className="text-lg font-semibold text-on-surface">{title}</h3><p className="mt-2 text-sm text-on-surface-variant">{description}</p></div>;
}
