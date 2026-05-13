import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/livekit/token";

export async function POST(req: NextRequest) {
  try {
    const { roomName, participantIdentity, participantName, role } =
      await req.json();

    if (!roomName || !participantIdentity || !participantName) {
      return NextResponse.json(
        { error: "roomName, participantIdentity, and participantName are required" },
        { status: 400 }
      );
    }

    const metadata = role ? { role } : undefined;
    const token = await generateToken(
      roomName,
      participantIdentity,
      participantName,
      metadata
    );

    return NextResponse.json({ token });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate token";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
