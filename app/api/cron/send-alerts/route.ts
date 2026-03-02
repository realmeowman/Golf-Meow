import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendAlertEmail } from "@/lib/email";

// Vercel Cron calls this daily. Protect with CRON_SECRET.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Slots: 24-48 hours from now
  const now = new Date();
  const minTime = new Date(now);
  minTime.setHours(minTime.getHours() + 24);
  const maxTime = new Date(now);
  maxTime.setHours(maxTime.getHours() + 48);

  const { data: slots, error: slotsError } = await supabase
    .from("slots")
    .select(
      `
      id,
      tee_time,
      price_cents,
      course:courses(name, area_slug, booking_url)
    `
    )
    .gte("tee_time", minTime.toISOString())
    .lte("tee_time", maxTime.toISOString());

  if (slotsError || !slots?.length) {
    return NextResponse.json({
      ok: true,
      message: "No slots in window",
      sent: 0,
    });
  }

  // Group slots by area
  const slotsByArea = new Map<string, typeof slots>();
  for (const slot of slots) {
    const area = (slot.course as { area_slug: string })?.area_slug ?? "la-quinta";
    if (!slotsByArea.has(area)) slotsByArea.set(area, []);
    slotsByArea.get(area)!.push(slot);
  }

  // Get golfers by area preference
  const { data: golfers, error: golfersError } = await supabase
    .from("golfers")
    .select("id, email, area_slug");

  if (golfersError || !golfers?.length) {
    return NextResponse.json({
      ok: true,
      message: "No golfers",
      sent: 0,
    });
  }

  let sent = 0;

  for (const golfer of golfers) {
    const areaSlug = golfer.area_slug ?? "la-quinta";
    const areaSlots =
      areaSlug === "all"
        ? slots
        : (slotsByArea.get(areaSlug) ?? []);
    if (!areaSlots?.length) continue;

    const slotPayload = areaSlots.map((s) => ({
      courseName: (s.course as { name: string }).name,
      teeTime: new Date(s.tee_time).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      priceCents: s.price_cents,
      bookingUrl: (s.course as { booking_url?: string })?.booking_url ?? null,
    }));

    const result = await sendAlertEmail(golfer.email, slotPayload);
    if (result.ok) {
      sent++;
      // Track for attribution
      for (const slot of areaSlots) {
        await supabase.from("alerts_sent").insert({
          golfer_id: golfer.id,
          slot_id: slot.id,
        });
      }
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    slots: slots.length,
  });
}
