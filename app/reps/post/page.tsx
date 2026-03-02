import Link from "next/link";
import RepPostForm from "./RepPostForm";

const AREAS = [
  { slug: "la-quinta", name: "La Quinta" },
  { slug: "indian-wells", name: "Indian Wells" },
  { slug: "palm-desert", name: "Palm Desert" },
  { slug: "rancho-mirage", name: "Rancho Mirage" },
  { slug: "palm-springs", name: "Palm Springs" },
  { slug: "cathedral-city", name: "Cathedral City" },
];

export default async function RepPostPage({
  searchParams,
}: {
  searchParams: Promise<{
    course?: string;
    course_name?: string;
    area?: string;
    submitted?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const courseId = params.course ?? "";
  const courseName = params.course_name ?? "";
  const areaSlug = params.area ?? "la-quinta";
  const submitted = params.submitted === "1";
  const error = params.error;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <Link
          href="/reps"
          className="mb-6 inline-block text-sm text-stone-500 hover:text-stone-900"
        >
          ← Back to dashboard
        </Link>

        <h1 className="text-2xl font-semibold text-stone-900">
          Post a last-minute slot
        </h1>
        <p className="mt-2 text-stone-600">
          Fill empty tee times. We&apos;ll alert golfers. You only pay commission
          when we deliver a booking.
        </p>

        {submitted && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-800">
            Slot submitted. We&apos;ll include it in the next alert.
          </div>
        )}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-800">
            Something went wrong. Try again.
          </div>
        )}

        <div className="mt-8">
        <RepPostForm
          courseId={courseId}
          courseName={courseName}
          areaSlug={areaSlug}
          areas={AREAS}
        />
        </div>
      </div>
    </main>
  );
}
