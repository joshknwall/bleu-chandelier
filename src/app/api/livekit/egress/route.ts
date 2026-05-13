import { NextRequest, NextResponse } from "next/server";
import { getEgressClient } from "@/lib/livekit/server";
import { EncodedFileOutput, EncodedFileType } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const { roomName, outputPath } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: "roomName is required" }, { status: 400 });
    }

    const client = getEgressClient();

    const fileOutput = new EncodedFileOutput({
      fileType: EncodedFileType.MP4,
      filepath: outputPath ?? `recordings/${roomName}-${Date.now()}.mp4`,
    });

    const egress = await client.startRoomCompositeEgress(roomName, {
      file: fileOutput,
    });

    return NextResponse.json({ egressId: egress.egressId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start recording";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { egressId } = await req.json();

    if (!egressId) {
      return NextResponse.json({ error: "egressId is required" }, { status: 400 });
    }

    const client = getEgressClient();
    const egress = await client.stopEgress(egressId);

    return NextResponse.json({ egress });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to stop recording";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
