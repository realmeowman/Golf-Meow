import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const courseIdParam = (formData.get("course_id") as string)?.trim() || null;
    const courseName = (formData.get("course_name") as string)?.trim();
    const areaSlug = (formData.get("area_slug") as string)?.trim();
    const teeTime = formData.get("tee_time") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const bookingUrl = (formData.get("booking_url") as string)?.trim() || null;
    const submittedBy = (formData.get("submitted_by") as string)?.trim() || null;
    const rackRate = (formData.get("rack_rate") as string)?.trim();
    const rackRateCents = rackRate ? Math.round(parseFloat(rackRate) * 100) : null;
    const redirectTo = (formData.get("redirect") as string)?.trim() || "/courses";

    if ((!courseIdParam && (!courseName || !areaSlug)) || !teeTime || !price || isNaN(price)) {
      const base = new URL(request.url).origin;
      return NextResponse.redirect(`${base}${redirectTo}${redirectTo.includes("?") ? "&" : "?"}error=missing_fields`);
    }

    // Use course_id if provided, else find or create by name + area
    let courseId: string | null = courseIdParam;
    if (!courseId) {
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("name", courseName)
      .eq("area_slug", areaSlug)
      .maybeSingle();

    courseId = course?.id ?? null;
    }

    // Update rack rate on existing course if provided
    if (courseId && rackRateCents !== null) {
      await supabase
        .from("courses")
        .update({ rack_rate_cents: rackRateCents })
        .eq("id", courseId);
    }

    if (!courseId) {
      const { data: newCourse, error: insertCourseError } = await supabase
        .from("courses")
        .insert({
          name: courseName,
          area_slug: areaSlug,
          booking_url: bookingUrl,
          rack_rate_cents: rackRateCents,
        })
        .select("id")
        .single();

      if (insertCourseError) {
        console.error("Course insert error:", insertCourseError.message, insertCourseError);
        const base = new URL(request.url).origin;
        return NextResponse.redirect(`${base}${redirectTo}${redirectTo.includes("?") ? "&" : "?"}error=submit_failed`);
      }
      courseId = newCourse?.id;
    }

    const teeTimeDate = new Date(teeTime);
    const priceCents = Math.round(price * 100);

    const { error: slotError } = await supabase.from("slots").insert({
      course_id: courseId,
      tee_time: teeTimeDate.toISOString(),
      price_cents: priceCents,
      submitted_by: submittedBy,
    });

    if (slotError) {
      console.error("Slot insert error:", slotError.message, slotError);
      const base = new URL(request.url).origin;
      return NextResponse.redirect(`${base}${redirectTo}${redirectTo.includes("?") ? "&" : "?"}error=submit_failed`);
    }

    const base = new URL(request.url).origin;
    const successUrl = redirectTo.includes("?") ? `${redirectTo}&submitted=1` : `${redirectTo}?submitted=1`;
    return NextResponse.redirect(`${base}${successUrl}`);
  } catch (err) {
    console.error("Slot submit error:", err);
    const base = new URL(request.url).origin;
    return NextResponse.redirect(`${base}/courses?error=submit_failed`);
  }
}
