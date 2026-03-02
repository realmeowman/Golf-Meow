import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const areaSlug = (formData.get("area_slug") as string) || "la-quinta";

    if (!email) {
      return NextResponse.redirect(
        new URL("/?error=missing_email", request.url)
      );
    }

    const { error } = await supabase.from("golfers").upsert(
      { email, area_slug: areaSlug },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Signup error:", error);
      return NextResponse.redirect(
        new URL("/?error=signup_failed", request.url)
      );
    }

    return NextResponse.redirect(new URL("/?signed_up=1", request.url));
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.redirect(
      new URL("/?error=signup_failed", request.url)
    );
  }
}
