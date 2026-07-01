import { notFound } from "next/navigation";
import { TimedAuctionView } from "@/components/auction/TimedAuctionView";
import { MOCK_LISTINGS } from "@/lib/mock-data";

interface AuctionPageProps {
  params: Promise<{ id: string }>;
}

export default async function AuctionPage({ params }: AuctionPageProps) {
  const { id } = await params;
  const listing = MOCK_LISTINGS.find((l) => l.id === id);
  if (!listing) notFound();

  return <TimedAuctionView listing={listing} />;
}