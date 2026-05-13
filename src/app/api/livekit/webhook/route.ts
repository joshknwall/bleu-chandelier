import { NextRequest, NextResponse } from "next/server";
import { WebhookReceiver } from "livekit-server-sdk";

const KNOWN_EVENTS = [
  "room_started",
  "room_finished",
  "participant_joined",
  "participant_left",
  "track_published",
  "track_unpublished",
  "egress_started",
  "egress_ended",
];

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: "LiveKit credentials not configured" }, { status: 500 });
    }

    const receiver = new WebhookReceiver(apiKey, apiSecret);
    const body = await req.text();
    const authorization = req.headers.get("Authorization") ?? "";

    const event = receiver.receive(body, authorization);

    const eventType = (event as { event?: string }).event ?? "unknown";
    if (KNOWN_EVENTS.includes(eventType)) {
      console.log(`[LiveKit webhook] event=${eventType}`);
    } else {
      console.log(`[LiveKit webhook] unknown event type received`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
