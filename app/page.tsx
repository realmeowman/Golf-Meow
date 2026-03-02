import Link from "next/link";

type SearchParams = { signed_up?: string; error?: string };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const signedUp = params.signed_up === "1";
  const error = params.error;

  const AREAS = [
  { name: "La Quinta", slug: "la-quinta" },
  { name: "Indian Wells", slug: "indian-wells" },
  { name: "Palm Desert", slug: "palm-desert" },
  { name: "Rancho Mirage", slug: "rancho-mirage" },
];

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Golf Meow
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Last-minute tee time deals in the Coachella Valley
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Value prop */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            Get last-minute deals.{" "}
            <span className="text-green-700">Zero booking fees.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-stone-600">
            Courses hate empty tee times. We alert you when they drop prices on
            same-day and next-day slots in La Quinta, Indian Wells, Palm Desert,
            and Rancho Mirage.
          </p>
          <p className="mt-2 text-stone-500">
            No convenience fees. No membership. Just deals.
          </p>
        </section>

        {/* Signup CTA */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          {signedUp && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
              You&apos;re signed up. We&apos;ll email you when deals drop.
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
              <p className="font-medium">Something went wrong. Try again.</p>
              <p className="mt-2 text-sm">
                Make sure <code className="rounded bg-red-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> in
                .env.local is correct (no &quot;xxx&quot; placeholder). Check the terminal for details.
              </p>
            </div>
          )}
          <h3 className="text-xl font-semibold text-stone-900">
            Get deal alerts
          </h3>
          <p className="mt-2 text-stone-600">
            Enter your email. We&apos;ll send you last-minute tee time deals as
            they drop.
          </p>
          <div className="mt-6">
            <form
              action="/api/signup"
              method="POST"
              className="flex flex-col gap-4"
            >
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
              <select
                name="area_slug"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                <option value="la-quinta">La Quinta</option>
                <option value="indian-wells">Indian Wells</option>
                <option value="palm-desert">Palm Desert</option>
                <option value="rancho-mirage">Rancho Mirage</option>
                <option value="all">All Coachella Valley</option>
              </select>
              <button
                type="submit"
                className="w-full rounded-lg bg-green-700 px-6 py-4 font-medium text-black transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Sign up
              </button>
            </form>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            We cover: {AREAS.map((a) => a.name).join(", ")}. Unsubscribe
            anytime.
          </p>
        </section>

        {/* Areas we cover */}
        <section>
          <h3 className="text-lg font-semibold text-stone-900">
            Areas we cover
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {AREAS.map((area) => (
              <div
                key={area.slug}
                className="rounded-lg border border-stone-200 bg-white px-4 py-3"
              >
                <span className="font-medium text-stone-900">{area.name}</span>
                <span className="ml-2 text-stone-500">courses</span>
              </div>
            ))}
          </div>
        </section>

        {/* Course signup link */}
        <section className="mt-12 border-t border-stone-200 pt-8">
          <p className="mb-4 text-sm text-stone-600">
            Are you a course with last-minute availability?
          </p>
          <Link
            href="/courses"
            className="inline-block rounded-lg bg-green-700 px-6 py-3 font-medium text-black transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Submit a slot
          </Link>
        </section>
      </div>
    </main>
  );
}
