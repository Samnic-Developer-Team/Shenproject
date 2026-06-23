import { notFound } from "next/navigation";
import { getSalonById } from "@/services/salon.service";
import { SalonDetailContainer } from "@/components/salon/SalonDetailContainer";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seller = await getSalonById(slug);

  if (!seller) notFound();

  const salon = {
    slug: seller._id,
    name: seller.salonName,
    rating: "4.8",
    distance: `${seller.city}, ${seller.state}`,
    price: "₹₹₹",
    description: seller.bio || "",
    location: `${seller.city}, ${seller.state}`,
    image: seller.shopImage,
  };

  return <SalonDetailContainer salon={salon} />;
}