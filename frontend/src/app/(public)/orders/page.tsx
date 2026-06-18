import { Container } from "@/components/common/Container";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { TrackingCard } from "@/components/tracking/TrackingCard";

export default function Page() {
  return (
    <Container>
      <div className="grid gap-6 py-8">
        <OrderHistory />
        <TrackingCard />
      </div>
    </Container>
  );
}