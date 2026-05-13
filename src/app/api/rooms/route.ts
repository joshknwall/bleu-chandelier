import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { clientName, eventName, livekitRoomName, templateId } = body;

    if (!clientName || !eventName || !livekitRoomName) {
      return NextResponse.json(
        { error: "clientName, eventName, and livekitRoomName are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("rooms")
      .insert({
        client_name: clientName,
        event_name: eventName,
        livekit_room_name: livekitRoomName,
        template_id: templateId ?? null,
        status: "active",
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ room: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
