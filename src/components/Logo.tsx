import Link from "next/link";
import type { Locale } from "@/i18n/config";

type LogoProps = {
  locale: Locale;
  /** "light" = white wordmark for dark backgrounds, "dark" = navy wordmark for light backgrounds. */
  tone?: "light" | "dark";
};

/**
 * Official Delta Muscat brand lockup (PNG exports from the company's brand
 * assets, transparent background).
 */
export default function Logo({ locale, tone = "light" }: LogoProps) {
  return (
    <Link
      href={`/${locale}`}
      className="inline-flex items-center"
      aria-label={
        locale === "ar"
          ? "دلتا مسقط للحديد والألمنيوم — الصفحة الرئيسية"
          : "Delta Muscat Steel & Aluminium — home"
      }
    >
      <img
        src={
          tone === "light"
            ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/delta-muscat-logo-light.png`
            : `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/delta-muscat-logo.png`
        }
        alt=""
        width={685}
        height={147}
        className="h-9 w-auto max-w-none lg:h-11"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}
