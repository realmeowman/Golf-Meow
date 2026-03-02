import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, name, area_slug, booking_url")
    .eq("id", id)
    .single();

  if (courseError || !course) {
    notFound();
  }

  const now = new Date();
  const weekOut = new Date(now);
  weekOut.setDate(weekOut.getDate() + 7);

  const { data: slots } = await supabase
    .from("slots")
    .select("id, tee_time, price_cents, booking_url")
    .eq("course_id", id)
    .gte("tee_time", now.toISOString())
    .lte("tee_time", weekOut.toISOString())
    .order("tee_time", { ascending: true });

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-stone-500 hover:text-stone-900"
        >
          ← Back to deals
        </Link>

        <div className="mb-8 rounded-xl border border-stone-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-stone-900">{course.name}</h1>
          <p className="mt-1 text-sm capitalize text-stone-500">
            {course.area_slug.replace("-", " ")}
          </p>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-stone-900">
          Available deals
        </h2>

        {!slots?.length ? (
          <p className="rounded-xl border border-stone-200 bg-white px-6 py-12 text-center text-stone-500">
            No deals at {course.name} right now. Check back later or sign up for
            alerts.
          </p>
        ) : (
          <div className="space-y-3">
            {slots.map((slot) => (
              <a
                key={slot.id}
                href={
                  (course as { booking_url?: string }).booking_url ?? "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-stone-200 bg-white p-5 transition hover:border-stone-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-900">
                      {new Date(slot.tee_time).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      ${(slot.price_cents / 100).toFixed(0)} per person
                    </p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700">
                    Book
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
