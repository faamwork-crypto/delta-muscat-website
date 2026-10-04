import Link from "next/link";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const path = (p: string) => (p === "" ? `/${locale}` : `/${locale}/${p}`);

  const solutionLinks = dict.solutions.slugList.map((slug) => ({
    label: (dict.solutions[slug as "pergolas"] as { name: string }).name,
    href: path(`solutions/${slug}`),
  }));

  return (
    <footer className="bg-graphite-deep text-paper">
      {/* Main footer */}
      <div className="container-site grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
        <div>
          <Logo locale={locale} tone="light" />
          <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-steel-light">
            {dict.footer.tagline}
          </p>
          <p className="mt-6 border-s-2 border-bronze/60 ps-4 text-[13px] leading-relaxed text-steel">
            {dict.footer.madeIn}
          </p>
        </div>

        <nav aria-label={dict.footer.companyTitle}>
          <h2 className="text-[11px] font-semibold tracking-[0.22em] text-bronze-soft uppercase">
            {dict.footer.companyTitle}
          </h2>
          <ul className="mt-5 space-y-3">
            {dict.footer.companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={path(link.href.replace(/^\//, ""))}
                  className="text-[14px] text-steel-light transition-colors hover:text-paper"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.footer.solutionsTitle}>
          <h2 className="text-[11px] font-semibold tracking-[0.22em] text-bronze-soft uppercase">
            {dict.footer.solutionsTitle}
          </h2>
          <ul className="mt-5 space-y-3">
            {solutionLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[14px] text-steel-light transition-colors hover:text-paper"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[11px] font-semibold tracking-[0.22em] text-bronze-soft uppercase">
            {dict.footer.contactTitle}
          </h2>
          <address className="mt-5 space-y-3 text-[14px] not-italic text-steel-light">
            <p>
              <span className="block">
                {dict.contact.info.headOffice}:
              </span>
              <span className="flex flex-wrap gap-x-5 gap-y-1">
                <a href={site.headOfficePhoneHref} dir="ltr" className="transition-colors hover:text-paper">
                  {site.headOfficePhone}
                </a>
                <a href={site.headOfficePhone2Href} dir="ltr" className="transition-colors hover:text-paper">
                  {site.headOfficePhone2}
                </a>
              </span>
            </p>
            <p>
              <a href={site.factoryPhoneHref} className="transition-colors hover:text-paper">
                {dict.contact.info.factory}: {site.factoryPhone}
              </a>
            </p>
            <p>
              <a href={site.emailHref} className="break-all transition-colors hover:text-paper">
                {site.email}
              </a>
            </p>
            <p className="pt-2 leading-relaxed text-steel">{site.factoryAddress}</p>
          </address>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line-light">
        <div className="container-site flex flex-col gap-2 py-6 text-[12px] tracking-[0.04em] text-steel sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {dict.common.companyName}. {dict.footer.rights}
          </p>
          <p className="text-steel">
            {dict.footer.crPrefix} {site.crNumber}
          </p>
        </div>
      </div>
    </footer>
  );
}
