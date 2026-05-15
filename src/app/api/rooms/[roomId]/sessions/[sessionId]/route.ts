import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ roomId: string; sessionId: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { roomId, sessionId } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from("room_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("room_id", roomId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
