import { NextResponse } from "next/server";

/**
 * WebSocket upgrade endpoint placeholder.
 * Production: deploy Socket.io server on separate Node process or use Pusher/Ably.
 * Live rooms use this for: bids, chat, emoji storms, HOLD events, viewer counts.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Blingbids WebSocket gateway",
    endpoints: {
      liveRoom: "wss://ws.blingbids.com/room/{auctionId}",
      events: ["bid", "chat", "hold", "viewer_count", "auction_end"],
    },
  });
}