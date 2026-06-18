import { notFound } from "next/navigation";
import { salons } from "@/data/salons";
import { SalonDetailContainer } from "@/components/salon/SalonDetailContainer";

export function generateStaticParams() {
  return salons.map((salon) => ({ slug: salon.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const salon = salons.find((item) => item.slug === slug);

  if (!salon) notFound();

  return <SalonDetailContainer salon={salon} />;
}