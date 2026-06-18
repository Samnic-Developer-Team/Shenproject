import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { Container } from "@/components/common/Container";
import { ServiceDetails } from "@/components/service/ServiceDetails";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) notFound();

  return (
    <Container>
      <div className="py-8">
        <ServiceDetails service={service} />
      </div>
    </Container>
  );
}