import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function RepsPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const params = await searchParams;
  const courseId = params.course;

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name, area_slug")
    .order("name");

  let slots: { id: string; tee_time: string; price_cents: number }[] = [];
  let selectedCourse: { id: string; name: string; area_slug: string } | null =
    null;

  if (courseId) {
    const courseRes = await supabase
      .from("courses")
      .select("id, name, area_slug")
      .eq("id", courseId)
      .single();
    selectedCourse = courseRes.data ?? null;

    if (selectedCourse) {
      const now = new Date();
      const weekOut = new Date(now);
      weekOut.setDate(weekOut.getDate() + 14);
      const { data: slotsData } = await supabase
        .from("slots")
        .select("id, tee_time, price_cents")
        .eq("course_id", courseId)
        .gte("tee_time", now.toISOString())
        .lte("tee_time", weekOut.toISOString())
        .order("tee_time", { ascending: true });
      slots = slotsData ?? [];
    }
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900">
            Course Rep Dashboard
          </h1>
          <p className="mt-2 text-stone-600">
            Select your course to view current deals and post new slots.
          </p>
        </div>

        {/* Course selector */}
        <div className="mb-8">
          <p className="mb-3 text-sm font-medium text-stone-700">
            Or select your course:
          </p>
          <div className="flex flex-wrap gap-2">
            {(courses ?? []).map((c) => (
              <Link
                key={c.id}
                href={`/reps?course=${c.id}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  courseId === c.id
                    ? "bg-emerald-800 text-white"
                    : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-300"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {selectedCourse && (
          <>
            {/* Post new slot - prominent CTA */}
            <div className="mb-8 rounded-xl border-2 border-green-700 bg-green-50 p-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Post a new slot
              </h2>
              <p className="mt-2 text-stone-600">
                Fill an empty tee time. We&apos;ll alert golfers in your area.
              </p>
              <Link
                href={`/reps/post?course=${selectedCourse.id}&course_name=${encodeURIComponent(selectedCourse.name)}&area=${selectedCourse.area_slug}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-green-700 px-6 py-4 font-medium text-black transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
              >
                Post new slot
              </Link>
            </div>

            {/* Current deals */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Current deals — {selectedCourse.name}
              </h2>
              {slots.length === 0 ? (
                <p className="mt-4 text-stone-500">
                  No active deals. Post one above.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 px-4 py-3"
                    >
                      <p className="text-stone-900">
                        {new Date(slot.tee_time).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="font-medium text-stone-900">
                        ${(slot.price_cents / 100).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
