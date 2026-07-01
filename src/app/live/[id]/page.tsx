import { notFound } from "next/navigation";
import { LiveRoom } from "@/components/live/LiveRoom";
import { MOCK_LISTINGS } from "@/lib/mock-data";

interface LiveRoomPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ seller?: string }>;
}

export default async function LiveRoomPage({ params, searchParams }: LiveRoomPageProps) {
  const { id } = await params;
  const { seller } = await searchParams;
  const listing = MOCK_LISTINGS.find((l) => l.id === id);

  if (!listing) notFound();

  return <LiveRoom listing={listing} isSeller={seller === "1"} />;
}