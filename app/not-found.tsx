import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Screen } from "@/components/screens/Screen";

export default function NotFound() {
  return (
    <Screen narrow>
      <div className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
        <Logo size="lg" className="text-brand" />
        <p className="mt-4 text-strong text-ink">გვერდი ვერ მოიძებნა</p>
        <p className="mt-1 text-small text-ink-2">
          ეს ბმული აღარ არსებობს ან არასწორად აკრიფეთ.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded bg-brand px-4 text-strong text-white"
        >
          მთავარზე დაბრუნება
        </Link>
      </div>
    </Screen>
  );
}
