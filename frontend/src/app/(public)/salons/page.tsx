import { salons } from "@/data/salons";
import { SalonCard } from "@/components/salon/SalonCard";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";

export default function Page() {
  return (
    <Container>
      <SectionTitle title="Salons" description="Browse salon listings." />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {salons.map((salon) => (
          <SalonCard key={salon.slug} salon={salon} />
        ))}
      </div>
    </Container>
  );
}