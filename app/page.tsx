import Link from "next/link";
import { supabase } from "@/lib/supabase";

const AREAS = [
  { name: "La Quinta", slug: "la-quinta" },
  { name: "Indian Wells", slug: "indian-wells" },
  { name: "Palm Desert", slug: "palm-desert" },
  { name: "Rancho Mirage", slug: "rancho-mirage" },
  { name: "Palm Springs", slug: "palm-springs" },
  { name: "Cathedral City", slug: "cathedral-city" },
];

type SearchParams = { signed_up?: string; error?: string; area?: string; q?: string };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const signedUp = params.signed_up === "1";
  const error = params.error;
  const searchQuery = (params.q || params.area || "").trim().toLowerCase();
  const matchedArea =
    searchQuery === "all"
      ? null
      : AREAS.find(
          (a) =>
            a.slug === searchQuery ||
            a.name.toLowerCase() === searchQuery ||
            a.name.toLowerCase().includes(searchQuery)
        );
  const effectiveAreaSlug = searchQuery === "all" ? "all" : matchedArea?.slug ?? (searchQuery ? "all" : "all");
  const area = matchedArea ?? AREAS[0];

  // Slots in next 7 days for this area, ordered by price
  const now = new Date();
  const weekOut = new Date(now);
  weekOut.setDate(weekOut.getDate() + 7);

  const { data: slots } = await supabase
    .from("slots")
    .select(
      `
      id, tee_time, price_cents,
      course:courses(id, name, area_slug, booking_url, rack_rate_cents)
    `
    )
    .gte("tee_time", now.toISOString())
    .lte("tee_time", weekOut.toISOString());

  const slotsInArea =
    effectiveAreaSlug === "all" || !effectiveAreaSlug
      ? slots ?? []
      : (slots ?? []).filter(
          (s) =>
            (s.course as unknown as { area_slug: string })?.area_slug === effectiveAreaSlug
        );

  const featuredDeals = [...slotsInArea].sort(
    (a, b) => a.price_cents - b.price_cents
  ).slice(0, 6);

  // Courses with deals in this area
  const courseIds = Array.from(
    new Set(
      slotsInArea.map((s) => (s.course as unknown as { id: string })?.id).filter(Boolean)
    )
  );
  const { data: courses } =
    courseIds.length > 0
      ? await supabase
          .from("courses")
          .select("id, name, area_slug")
          .in("id", courseIds)
      : { data: [] };

  const coursesInArea =
    effectiveAreaSlug === "all" || !effectiveAreaSlug
      ? courses ?? []
      : (courses ?? []).filter((c) => c.area_slug === effectiveAreaSlug);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Location search */}
        <div className="mb-8">
          <form action="/" method="GET" className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? params.area ?? (effectiveAreaSlug !== "all" ? area.name : "")}
              placeholder="Search location (e.g. Palm Springs, La Quinta)"
              list="area-list"
              className="flex-1 rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
            <datalist id="area-list">
              {AREAS.map((a) => (
                <option key={a.slug} value={a.name} />
              ))}
              <option value="All" />
            </datalist>
            <button
              type="submit"
              className="rounded-lg bg-stone-900 px-4 py-3 font-medium text-white transition hover:bg-stone-800"
            >
              Search
            </button>
          </form>
          <p className="mt-2 text-sm text-stone-500">
            Try: La Quinta, Indian Wells, Palm Desert, Rancho Mirage, Palm
            Springs, Cathedral City, or leave empty for all
          </p>
        </div>

        {/* Featured Deals */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-stone-900">
            Featured Deals
          </h2>
          {featuredDeals.length === 0 ? (
            <p className="rounded-xl border border-stone-200 bg-white px-6 py-12 text-center text-stone-500">
              No deals {effectiveAreaSlug !== "all" ? `in ${area.name} ` : ""}right now. Sign up for alerts and we&apos;ll
              email you when new ones drop.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {featuredDeals.map((slot) => {
                const course = slot.course as unknown as {
                  id: string;
                  name: string;
                  booking_url?: string;
                  rack_rate_cents?: number | null;
                };
                const rackRate = course?.rack_rate_cents ?? 0;
                const savings =
                  rackRate > 0 && rackRate > slot.price_cents
                    ? Math.round((rackRate - slot.price_cents) / 100)
                    : 0;
                return (
                  <Link
                    key={slot.id}
                    href={`/courses/${course?.id}`}
                    className="group rounded-xl border border-stone-200 bg-white p-5 transition hover:border-stone-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-stone-900 group-hover:text-green-800">
                          {course?.name ?? "Course"}
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                          {new Date(slot.tee_time).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                        {savings > 0 && (
                          <p className="mt-2 text-sm font-medium text-red-600">
                            Save ${savings} vs usual
                          </p>
                        )}
                      </div>
                      <p className="text-lg font-semibold text-stone-900">
                        ${(slot.price_cents / 100).toFixed(0)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Courses in your area */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-stone-900">
            Courses with deals
          </h2>
          {coursesInArea.length === 0 ? (
            <p className="text-sm text-stone-500">
              No courses with active deals {effectiveAreaSlug !== "all" ? `in ${area.name}` : ""}.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {coursesInArea.map((c) => (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}`}
                  className="rounded-xl border border-stone-200 bg-white px-5 py-4 font-medium text-stone-900 transition hover:border-stone-300 hover:shadow-sm hover:text-green-800"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Signup CTA */}
        <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          {signedUp && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
              You&apos;re signed up. We&apos;ll email you when deals drop.
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
              <p className="font-medium">Something went wrong. Try again.</p>
            </div>
          )}
          <h3 className="text-lg font-semibold text-stone-900">
            Get deal alerts
          </h3>
          <p className="mt-2 text-stone-600">
            Enter your email. We&apos;ll send you last-minute tee time deals as
            they drop.
          </p>
          <form action="/api/signup" method="POST" className="mt-6 flex flex-col gap-4">
            <input type="hidden" name="area_slug" value={effectiveAreaSlug} />
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full max-w-sm rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
            />
            <button
              type="submit"
              className="w-full max-w-sm rounded-lg bg-stone-900 px-6 py-3 font-medium text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
            >
              Sign up for alerts
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
