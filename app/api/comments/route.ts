import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  if (ids.length === 0) return NextResponse.json({ counts: {} });

  const { data, error } = await supabase
    .from("reel_comments")
    .select("reel_id")
    .in("reel_id", ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const counts: Record<string, number> = {};
  for (const row of data) counts[row.reel_id] = (counts[row.reel_id] ?? 0) + 1;
  return NextResponse.json({ counts });
}
