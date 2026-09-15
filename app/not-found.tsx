import Link from "next/link";
import { Screen } from "@/components/screens/Screen";

export default function NotFound() {
  return (
    <Screen>
      <div className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
        <p className="text-h1 tracking-tight text-ink">Accelerate</p>
        <p className="mt-4 text-strong text-ink">გვერდი ვერ მოიძებნა</p>
        <p className="mt-1 text-small text-ink-2">
          ეს ბმული აღარ არსებობს ან არასწორად აკრიფეთ.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded bg-ink px-4 text-strong text-white"
        >
          მთავარზე დაბრუნება
        </Link>
      </div>
    </Screen>
  );
}
