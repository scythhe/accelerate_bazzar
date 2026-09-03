import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6">
      <div>
        {/* The wordmark is the only loud element in the interface. */}
        <p className="text-3xl font-bold tracking-tight text-ink">Accelerate</p>
        <p className="mt-2 text-base text-ink-muted">
          მომწოდებლები და რესტორნები — ერთ სივრცეში.
        </p>
      </div>
      <p className="text-sm text-ink-muted">
        ეს არის საძირკვლის ეტაპი. პრიმიტიული კომპონენტები იხილეთ ქვემოთ.
      </p>
      <Link
        href="/kitchen-sink"
        className="inline-flex h-tap w-fit items-center rounded-md bg-accent px-5 font-medium text-accent-ink"
      >
        კომპონენტების გვერდი
      </Link>
    </main>
  );
}
