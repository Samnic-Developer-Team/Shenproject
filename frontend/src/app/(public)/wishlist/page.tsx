import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";

export default function Page() {
  return (
    <Container>
      <div className="py-8">
        <EmptyState title="Wishlist" description="Saved items will appear here." />
      </div>
    </Container>
  );
}