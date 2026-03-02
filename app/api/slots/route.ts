import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const courseName = (formData.get("course_name") as string)?.trim();
    const areaSlug = (formData.get("area_slug") as string)?.trim();
    const teeTime = formData.get("tee_time") as string;
    const price = parseInt(formData.get("price") as string, 10);
    const bookingUrl = (formData.get("booking_url") as string)?.trim() || null;
    const submittedBy = (formData.get("submitted_by") as string)?.trim() || null;

    if (!courseName || !areaSlug || !teeTime || !price || isNaN(price)) {
      return NextResponse.redirect(
        new URL("/courses?error=missing_fields", request.url)
      );
    }

    // Find or create course by name + area
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("name", courseName)
      .eq("area_slug", areaSlug)
      .maybeSingle();

    let courseId = course?.id;

    if (!courseId) {
      const { data: newCourse, error: insertCourseError } = await supabase
        .from("courses")
        .insert({ name: courseName, area_slug: areaSlug, booking_url: bookingUrl })
        .select("id")
        .single();

      if (insertCourseError) {
        console.error("Course insert error:", insertCourseError.message, insertCourseError);
        return NextResponse.redirect(
          new URL(`/courses?error=submit_failed&code=${encodeURIComponent(insertCourseError.code || "")}`, request.url)
        );
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
      return NextResponse.redirect(
        new URL(`/courses?error=submit_failed&code=${encodeURIComponent(slotError.code || "")}`, request.url)
      );
    }

    return NextResponse.redirect(new URL("/courses?submitted=1", request.url));
  } catch (err) {
    console.error("Slot submit error:", err);
    return NextResponse.redirect(
      new URL("/courses?error=submit_failed", request.url)
    );
  }
}
