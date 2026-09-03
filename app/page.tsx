import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-4">
      <div>
        {/* The wordmark is the only loud element in the interface. */}
        <p className="text-h1 tracking-tight text-ink">Accelerate</p>
        <p className="mt-2 text-body text-ink-2">
          მომწოდებლები და რესტორნები — ერთ სივრცეში.
        </p>
      </div>
      <p className="text-small text-ink-3">
        საძირკვლის ეტაპი. კომპონენტების ინვენტარი და ძებნის შედეგების
        დემონსტრაცია ქვემოთ.
      </p>
      <div className="flex flex-col gap-3">
        <Link
          href="/kitchen-sink"
          className="inline-flex h-10 w-fit items-center rounded bg-ink px-4 text-strong text-white"
        >
          კომპონენტების გვერდი
        </Link>
        <Link
          href="/kitchen-sink/results"
          className="inline-flex h-10 w-fit items-center rounded border border-line-strong px-4 text-strong text-ink"
        >
          ძებნის შედეგები — 12 რიგი
        </Link>
      </div>
    </main>
  );
}
