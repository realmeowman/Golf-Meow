"use client";

export default function RepPostForm({
  courseId,
  courseName,
  areaSlug,
  areas,
}: {
  courseId: string;
  courseName: string;
  areaSlug: string;
  areas: { slug: string; name: string }[];
}) {
  return (
    <form
      id="slot-form"
      action="/api/slots"
      method="POST"
      className="mt-8 space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
    >
      <input type="hidden" name="redirect" value="/reps/post" />
      {courseId && <input type="hidden" name="course_id" value={courseId} />}
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
          defaultValue={courseName}
          placeholder="e.g. PGA West"
          className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
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
          defaultValue={areaSlug}
          className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
        >
          {areas.map((area) => (
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
          className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
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
          className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
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
          className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
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
          className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
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
          className="mt-2 w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-stone-900 px-6 py-3 font-medium text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
      >
        Submit slot
      </button>
    </form>
  );
}
