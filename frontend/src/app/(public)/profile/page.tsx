import { Container } from "@/components/common/Container";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { UserInfo } from "@/components/profile/UserInfo";
import { BookingHistory } from "@/components/profile/BookingHistory";

export default function Page() {
  return (
    <Container>
      <div className="grid gap-6 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ProfileSidebar />
        <div className="grid gap-6">
          <UserInfo />
          <BookingHistory />
        </div>
      </div>
    </Container>
  );
}