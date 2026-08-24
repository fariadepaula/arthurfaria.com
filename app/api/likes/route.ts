import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  if (ids.length === 0) return NextResponse.json({ counts: {} });

  const { data, error } = await supabase
    .from("reel_likes")
    .select("reel_id, count")
    .in("reel_id", ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const counts = Object.fromEntries(data.map((row) => [row.reel_id, row.count]));
  return NextResponse.json({ counts });
}
