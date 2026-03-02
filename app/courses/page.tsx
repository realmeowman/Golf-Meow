import Link from "next/link";

type SearchParams = { submitted?: string; error?: string };

export default async function CourseSubmitPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const submitted = params.submitted === "1";
  const error = params.error;

  const AREAS = [
  { slug: "la-quinta", name: "La Quinta" },
  { slug: "indian-wells", name: "Indian Wells" },
  { slug: "palm-desert", name: "Palm Desert" },
  { slug: "rancho-mirage", name: "Rancho Mirage" },
  { slug: "palm-springs", name: "Palm Springs" },
  { slug: "cathedral-city", name: "Cathedral City" },
];

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link
            href="/"
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            ← Golf Meow
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-stone-900">
            Submit a last-minute slot
          </h1>
          <p className="mt-1 text-stone-600">
            Fill empty tee times. We&apos;ll alert golfers. You only pay
            commission when we deliver a booking.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-6 pb-32 pt-12">
        {submitted && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
            Slot submitted. We&apos;ll include it in the next alert.
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-medium">Something went wrong. Try again.</p>
            <p className="mt-2 text-sm">
              Check the terminal where <code className="rounded bg-red-100 px-1">npm run dev</code> is
              running for the error details. Common fix: run{" "}
              <code className="rounded bg-red-100 px-1">supabase/fix-rls.sql</code> in Supabase SQL
              Editor.
            </p>
          </div>
        )}
        <form
          id="slot-form"
          action="/api/slots"
          method="POST"
          className="space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
        >
        <input type="hidden" name="redirect" value="/courses" />
          <div>
            <label
              htmlFor="course_name"
              className="block text-sm font-medium text-stone-700"
            >
              Course name
            </label>
            <input
              type="text"
              id="course_name"
              name="course_name"
              required
              placeholder="e.g. PGA West"
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="area_slug"
              className="block text-sm font-medium text-stone-700"
            >
              Area
            </label>
            <select
              id="area_slug"
              name="area_slug"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            >
              {AREAS.map((area) => (
                <option key={area.slug} value={area.slug}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tee_time"
              className="block text-sm font-medium text-stone-700"
            >
              Tee time (date & time)
            </label>
            <input
              type="datetime-local"
              id="tee_time"
              name="tee_time"
              required
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="rack_rate"
              className="block text-sm font-medium text-stone-700"
            >
              Usual rack rate ($) — optional, for showing &quot;Save $X&quot;
            </label>
            <input
              type="number"
              id="rack_rate"
              name="rack_rate"
              min="1"
              step="1"
              placeholder="e.g. 150"
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-stone-700"
            >
              Price per person ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="1"
              step="1"
              placeholder="50"
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="booking_url"
              className="block text-sm font-medium text-stone-700"
            >
              Booking URL (optional)
            </label>
            <input
              type="url"
              id="booking_url"
              name="booking_url"
              placeholder="https://..."
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="submitted_by"
              className="block text-sm font-medium text-stone-700"
            >
              Your name/email (for our records)
            </label>
            <input
              type="text"
              id="submitted_by"
              name="submitted_by"
              placeholder="name or email"
              className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
        </form>

        {/* Fixed submit button - always visible at bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-stone-200 bg-white p-4 shadow-lg">
          <button
            type="submit"
            form="slot-form"
            className="w-full rounded-lg bg-green-700 px-6 py-3 font-medium text-black transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:max-w-xl sm:mx-auto"
          >
            Submit slot
          </button>
        </div>
      </div>
    </main>
  );
}
