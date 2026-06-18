import { Container } from "@/components/common/Container";
import { OrderTimeline } from "@/components/tracking/OrderTimeline";
import { TrackingStatus } from "@/components/tracking/TrackingStatus";

export default function Page() {
  return (
    <Container>
      <div className="grid gap-6 py-8">
        <TrackingStatus />
        <OrderTimeline />
      </div>
    </Container>
  );
}