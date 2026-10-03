import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Locale routing proxy (Next 16 convention, formerly "middleware").
 * - "/" and any locale-less path redirect to the best-matching locale prefix.
 * - Preferred language is taken from Accept-Language, defaulting to English.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  const accept = (request.headers.get("accept-language") ?? "").toLowerCase();
  const preferred = accept.startsWith("ar") ? "ar" : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and static files.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
