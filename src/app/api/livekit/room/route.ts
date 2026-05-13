import { NextRequest, NextResponse } from "next/server";
import { getRoomService } from "@/lib/livekit/server";

export async function POST(req: NextRequest) {
  try {
    const { roomName, emptyTimeout, maxParticipants } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: "roomName is required" }, { status: 400 });
    }

    const svc = getRoomService();
    const room = await svc.createRoom({
      name: roomName,
      emptyTimeout: emptyTimeout ?? 600,
      maxParticipants: maxParticipants ?? 10,
    });

    return NextResponse.json({ room });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { roomName } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: "roomName is required" }, { status: 400 });
    }

    const svc = getRoomService();
    await svc.deleteRoom(roomName);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
