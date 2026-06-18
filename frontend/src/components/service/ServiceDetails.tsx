import type { Service } from "@/types/service.types";

export function ServiceDetails({ service }: { service: Service }) {
  return <section className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-sm"><h1 className="text-3xl font-semibold text-on-surface">{service.label}</h1><p className="mt-2 text-sm text-on-surface-variant">{service.description}</p></section>;
}
