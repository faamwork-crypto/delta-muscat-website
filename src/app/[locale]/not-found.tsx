import Link from "next/link";

/**
 * Localized 404. Rendered inside the [locale] layout, but not-found pages do
 * not receive params, so the copy is deliberately bilingual and the locale is
 * read from the URL on the client where possible.
 */
export default function LocaleNotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-graphite-deep px-6 py-32 text-center text-paper">
      <p className="font-display text-[64px] leading-none text-bronze-soft">404</p>
      <h1 className="display-1 mt-6 text-paper">Page not found · الصفحة غير موجودة</h1>
      <p className="mt-4 max-w-md text-steel-light">
        The page you are looking for does not exist or has moved. · الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/en" className="btn btn-primaryDark">
          English home
        </Link>
        <Link href="/ar" className="btn btn-outlineLight">
          الرئيسية
        </Link>
      </div>
    </section>
  );
}
