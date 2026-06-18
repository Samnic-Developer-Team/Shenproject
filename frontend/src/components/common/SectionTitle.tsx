export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6 space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight text-on-surface md:text-3xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-on-surface-variant">{description}</p> : null}
    </div>
  );
}
