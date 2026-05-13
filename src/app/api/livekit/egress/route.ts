import { NextRequest, NextResponse } from "next/server";
import { getEgressClient } from "@/lib/livekit/server";
import { createClient } from "@/lib/supabase/server";
import { EncodedFileOutput, EncodedFileType } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const { roomName, sessionId } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: "roomName is required" }, { status: 400 });
    }

    const client = getEgressClient();

    const fileOutput = new EncodedFileOutput({
      fileType: EncodedFileType.MP4,
      filepath: `recordings/${roomName}/${Date.now()}.mp4`,
    });

    const egress = await client.startRoomCompositeEgress(roomName, {
      file: fileOutput,
    });

    // Update session record if sessionId provided
    if (sessionId) {
      const supabase = await createClient();
      await supabase
        .from("room_sessions")
        .update({ recording_status: "recording", egress_id: egress.egressId })
        .eq("id", sessionId);
    }

    return NextResponse.json({ egressId: egress.egressId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start recording";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { egressId, sessionId } = await req.json();

    if (!egressId) {
      return NextResponse.json({ error: "egressId is required" }, { status: 400 });
    }

    const client = getEgressClient();
    const egress = await client.stopEgress(egressId);

    // Update session record if sessionId provided
    if (sessionId) {
      const supabase = await createClient();
      await supabase
        .from("room_sessions")
        .update({ recording_status: "stopped", ended_at: new Date().toISOString() })
        .eq("id", sessionId);
    }

    return NextResponse.json({ egress });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to stop recording";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
