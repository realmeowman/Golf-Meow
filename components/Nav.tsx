import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          Golf Meow
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-stone-600 transition hover:text-stone-900"
          >
            Deals
          </Link>
          <Link
            href="/reps"
            className="text-sm font-medium text-stone-600 transition hover:text-stone-900"
          >
            For Courses
          </Link>
        </div>
      </div>
    </nav>
  );
}
