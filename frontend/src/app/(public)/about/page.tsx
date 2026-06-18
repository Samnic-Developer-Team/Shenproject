import { Container } from "@/components/common/Container";

export default function Page() {
  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-semibold text-on-surface">About</h1>
        <p className="mt-2 text-on-surface-variant">Marketplace frontend scaffold for the Shena project.</p>
      </div>
    </Container>
  );
}