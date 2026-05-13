import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRoomService } from "@/lib/livekit/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("rooms")
      .select("*, clients(name, avatar_url)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rooms: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch rooms";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await req.json();
    const { clientName, templateId, customAgenda } = body;

    if (!clientName) {
      return NextResponse.json({ error: "clientName is required" }, { status: 400 });
    }

    // Create or find client by name
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert({ name: clientName })
      .select()
      .single();

    if (clientError) {
      return NextResponse.json({ error: clientError.message }, { status: 500 });
    }

    // Generate unique LiveKit room slug
    const livekitRoom = `bc-${crypto.randomUUID().slice(0, 8)}`;

    // Insert room record
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({
        client_id: client.id,
        template_id: templateId ?? null,
        livekit_room: livekitRoom,
        status: "active",
        setup: customAgenda ? { custom_agenda: customAgenda } : {},
      })
      .select("*, clients(name, avatar_url)")
      .single();

    if (roomError) {
      return NextResponse.json({ error: roomError.message }, { status: 500 });
    }

    // Create LiveKit room
    try {
      const svc = getRoomService();
      await svc.createRoom({
        name: livekitRoom,
        emptyTimeout: 600,
        maxParticipants: 10,
      });
    } catch {
      // Non-fatal — room can still be used if LiveKit create fails (room auto-creates on join)
    }

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
