import type { Salon } from "@/types/salon.types";

export function SalonDetails({ salon }: { salon: Salon }) {
  return <section className="rounded-3xl border border-outline-variant/20 bg-white p-6 shadow-sm"><h1 className="text-3xl font-semibold text-on-surface">{salon.name}</h1><p className="mt-2 text-sm text-on-surface-variant">{salon.description}</p></section>;
}
