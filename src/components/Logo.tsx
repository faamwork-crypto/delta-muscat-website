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
        src={tone === "light" ? "/brand/delta-muscat-logo-light.png" : "/brand/delta-muscat-logo.png"}
        alt=""
        width={960}
        height={206}
        className="h-9 w-auto lg:h-11"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}
