"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, Fragment } from "react";
import Logo from "@/components/Logo";
import { btnClass } from "@/components/Button";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { otherLocale, type Locale } from "@/i18n/config";
import { categories, t as localized } from "@/lib/categories";

type NavTarget = { label: string; path: string };
type NavGroup = { label: string; path: string; overviewLabel: string; items: NavTarget[] };

function localizedPath(locale: Locale, path: string) {
  return path === "" ? `/${locale}` : `/${locale}/${path}`;
}

function switchLocalePath(pathname: string, target: Locale) {
  const segments = pathname.split("/");
  segments[1] = target;
  return segments.join("/") || `/${target}`;
}

export default function Header({
  locale,
  nav,
  common,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
  common: Dictionary["common"];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const groups: NavGroup[] = [
    {
      label: nav.solutions,
      path: "solutions",
      overviewLabel: nav.solutionsOverview,
      items: (["pergolas", "parking-shades", "shade-structures", "metal-decoration"] as const).map(
        (slug) => ({
          label:
            slug === "pergolas"
              ? "Pergolas"
              : slug === "parking-shades"
                ? "Parking Shades"
                : slug === "shade-structures"
                  ? "Shade Structures"
                  : "Metal Decoration",
          path: `solutions/${slug}`,
        })
      ),
    },
    {
      label: nav.sectors,
      path: "sectors",
      overviewLabel: nav.sectorsOverview,
      items: [
        { label: sectorLabel(0), path: "sectors#luxury-villas" },
        { label: sectorLabel(1), path: "sectors#hospitality" },
        { label: sectorLabel(2), path: "sectors#commercial" },
        { label: sectorLabel(3), path: "sectors#government" },
        { label: sectorLabel(4), path: "sectors#architects" },
      ],
    },
  ];

  /** Sector labels are locale-dependent; compute lazily from nav strings. */
  function sectorLabel(_: number) {
    const map: Record<Locale, string[]> = {
      en: [
        "Luxury Villas",
        "Hospitality & Hotels",
        "Commercial Projects",
        "Government & Public",
        "Architects & Contractors",
      ],
      ar: [
        "الفلل الفاخرة",
        "الضيافة والفنادق",
        "المشاريع التجارية",
        "الحكومة والمرافق",
        "المعماريون والمقاولون",
      ],
    };
    return map[locale][_];
  }

  const links: NavTarget[] = [
    { label: nav.process, path: "process" },
    { label: nav.materials, path: "materials" },
    { label: nav.gallery, path: "gallery" },
    { label: nav.about, path: "about" },
    { label: nav.contact, path: "contact" },
  ];

  const isActive = useCallback(
    (path: string) => {
      const current = pathname === `/${locale}` ? "" : pathname.replace(`/${locale}`, "").replace(/^\//, "");
      if (path === "") return pathname === `/${locale}`;
      return current === path || current.startsWith(`${path}/`) || (path.startsWith("sectors") && current.startsWith("sectors"));
    },
    [pathname, locale]
  );

  /**
   * Desktop mega-menu for the product taxonomy: one column per main
   * category, every subcategory linked. Panel anchors to the inline-end so
   * it opens toward the viewport centre in both LTR and RTL.
   */
  const productsDesktop = (
    <li className="group relative" onMouseLeave={() => setOpenGroup(null)}>
      <Link
        href={localizedPath(locale, "products")}
        className={`flex items-center gap-1.5 whitespace-nowrap py-2 text-[12px] font-semibold tracking-[0.06em] uppercase transition-opacity hover:opacity-70 ${
          isActive("products") ? "text-bronze-soft" : ""
        }`}
        aria-haspopup="true"
        onFocus={() => setOpenGroup("products")}
        onMouseEnter={() => setOpenGroup("products")}
      >
        {nav.products}
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </Link>
      <div
        className={`absolute start-0 top-full w-[min(880px,calc(100vw-2rem))] pt-3 transition-[opacity,transform] duration-300 ${
          openGroup === "products"
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div
          className="max-h-[72vh] overflow-y-auto border border-line bg-paper text-ink shadow-[var(--shadow-pop)] focus-within:pointer-events-auto"
          onMouseEnter={() => setOpenGroup("products")}
        >
          <Link
            href={localizedPath(locale, "products")}
            className="sticky top-0 block border-b border-line bg-paper px-6 py-3.5 text-[11px] font-semibold tracking-[0.18em] text-bronze-ink uppercase transition-colors hover:bg-paper-deep"
          >
            {nav.productsOverview}
          </Link>
          <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={localizedPath(locale, category.slug)}
                  className="text-[12px] font-semibold tracking-[0.16em] text-bronze-ink uppercase transition-opacity hover:opacity-70"
                >
                  {localized(category.name, locale)}
                </Link>
                <ul className="mt-2 border-t border-line pt-2">
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={localizedPath(locale, `${category.slug}/${sub.slug}`)}
                        className="block py-1.5 text-[13px] font-medium leading-snug text-ink-soft transition-colors hover:text-bronze-ink"
                      >
                        {localized(sub.name, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </li>
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll while the mobile menu is open, close on route change and Escape. */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) {
      lastFocused.current = document.activeElement as HTMLElement;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
        lastFocused.current?.focus?.();
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
    setOpenMobileGroup(null);
    setOpenMobileCategory(null);
  }, [pathname]);

  const solid = scrolled || mobileOpen;
  const other = otherLocale(locale);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
          solid
            ? "bg-paper/95 text-ink shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-md"
            : "bg-transparent text-paper"
        }`}
      >
        <div className="container-site flex h-[72px] items-center justify-between gap-6 lg:h-[84px]">
          <Logo locale={locale} tone={solid ? "dark" : "light"} />

          {/* Desktop navigation ------------------------------------------ */}
          <nav aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary"} className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-6">
              {groups.map((group) => (
                <Fragment key={group.path}>
                <li
                  className="group relative"
                  onMouseLeave={() => setOpenGroup(null)}
                >
                  <div className="flex items-center">
                    <Link
                      href={localizedPath(locale, group.path)}
                      className={`flex items-center gap-1.5 whitespace-nowrap py-2 text-[12px] font-semibold tracking-[0.06em] uppercase transition-opacity hover:opacity-70 ${
                        isActive(group.path) ? "text-bronze-soft" : ""
                      }`}
                      aria-haspopup="true"
                      onFocus={() => setOpenGroup(group.path)}
                      onMouseEnter={() => setOpenGroup(group.path)}
                    >
                      {group.label}
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
                        <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </Link>
                  </div>
                  <div
                    className={`absolute start-0 top-full min-w-[290px] pt-3 transition-[opacity,transform] duration-300 ${
                      openGroup === group.path
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0"
                    }`}
                  >
                    <div
                      className="border border-line bg-paper text-ink shadow-[var(--shadow-pop)] focus-within:pointer-events-auto"
                      onMouseEnter={() => setOpenGroup(group.path)}
                    >
                      <Link
                        href={localizedPath(locale, group.path)}
                        className="block border-b border-line px-6 py-3.5 text-[11px] font-semibold tracking-[0.18em] text-bronze-ink uppercase transition-colors hover:bg-paper-deep"
                      >
                        {group.overviewLabel}
                      </Link>
                      <ul>
                        {group.items.map((item) => (
                          <li key={item.path}>
                            <Link
                              href={localizedPath(locale, item.path)}
                              className="block px-6 py-3 text-[14px] font-medium transition-colors hover:bg-paper-deep hover:text-bronze-ink"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
                {group.path === "solutions" ? productsDesktop : null}
                </Fragment>
              ))}
              {links.slice(0, 3).map((link) => (
                <li key={link.path} className="hidden xl:list-item">
                  <Link
                    href={localizedPath(locale, link.path)}
                    className={`whitespace-nowrap py-2 text-[12px] font-semibold tracking-[0.06em] uppercase transition-opacity hover:opacity-70 ${
                      isActive(link.path) ? "text-bronze-soft" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right cluster: language, CTA, burger ------------------------- */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href={switchLocalePath(pathname, other)}
              lang={other}
              className={`hidden shrink-0 whitespace-nowrap border px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors sm:block ${
                solid
                  ? "border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper"
                  : "border-paper/35 text-paper hover:border-paper hover:bg-paper hover:text-ink"
              }`}
              aria-label={common.language}
            >
              {other === "ar" ? common.arabic : common.english}
            </Link>

            <Link
              href={localizedPath(locale, "contact")}
              className={`${btnClass("primary", "sm")} hidden whitespace-nowrap md:inline-flex`}
            >
              {common.requestConsultation}
            </Link>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? nav.closeMenu : nav.openMenu}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="relative block h-3.5 w-6">
                <span
                  className={`absolute inset-x-0 top-0 h-[1.5px] bg-current transition-transform duration-300 ${
                    mobileOpen ? "translate-y-[6.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-[1.5px] bg-current transition-transform duration-300 ${
                    mobileOpen ? "-translate-y-[6.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay ------------------------------------------------ */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-graphite-deep text-paper transition-[opacity,visibility] duration-500 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={nav.openMenu}
      >
        <div className="container-site flex-1 overflow-y-auto pb-10 pt-[92px]">
          <nav aria-label={locale === "ar" ? "قائمة الجوال" : "Mobile"}>
            <ul className="divide-y divide-line-light">
              {groups.map((group) => (
                <Fragment key={group.path}>
                <li key={group.path}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 text-start text-[15px] font-semibold tracking-[0.06em] uppercase"
                    aria-expanded={openMobileGroup === group.path}
                    onClick={() =>
                      setOpenMobileGroup((v) => (v === group.path ? null : group.path))
                    }
                  >
                    {group.label}
                    <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-300 ${openMobileGroup === group.path ? "rotate-180" : ""}`} aria-hidden="true">
                      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      openMobileGroup === group.path ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <ul className="overflow-hidden">
                      <li>
                        <Link
                          href={localizedPath(locale, group.path)}
                          className="block py-2.5 text-[13px] font-semibold tracking-[0.14em] text-bronze-soft uppercase"
                        >
                          {group.overviewLabel}
                        </Link>
                      </li>
                      {group.items.map((item) => (
                        <li key={item.path}>
                          <Link
                            href={localizedPath(locale, item.path)}
                            className="block py-2.5 text-[15px] text-steel-light"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                {group.path === "solutions" ? (
                  <li>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-start text-[15px] font-semibold tracking-[0.06em] uppercase"
                      aria-expanded={openMobileGroup === "products"}
                      onClick={() =>
                        setOpenMobileGroup((v) => (v === "products" ? null : "products"))
                      }
                    >
                      {nav.products}
                      <svg
                        viewBox="0 0 12 12"
                        className={`h-3 w-3 transition-transform duration-300 ${
                          openMobileGroup === "products" ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ${
                        openMobileGroup === "products" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <ul className="overflow-hidden">
                        <li>
                          <Link
                            href={localizedPath(locale, "products")}
                            className="block py-2.5 text-[13px] font-semibold tracking-[0.14em] text-bronze-soft uppercase"
                          >
                            {nav.productsOverview}
                          </Link>
                        </li>
                        {categories.map((category) => (
                          <li key={category.id}>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between py-2.5 ps-3 text-start text-[14px] font-semibold text-bronze-soft"
                              aria-expanded={openMobileCategory === category.id}
                              onClick={() =>
                                setOpenMobileCategory((v) =>
                                  v === category.id ? null : category.id,
                                )
                              }
                            >
                              {localized(category.name, locale)}
                              <svg
                                viewBox="0 0 12 12"
                                className={`h-2.5 w-2.5 shrink-0 transition-transform duration-300 ${
                                  openMobileCategory === category.id ? "rotate-180" : ""
                                }`}
                                aria-hidden="true"
                              >
                                <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                              </svg>
                            </button>
                            <div
                              className={`grid transition-[grid-template-rows] duration-300 ${
                                openMobileCategory === category.id
                                  ? "grid-rows-[1fr]"
                                  : "grid-rows-[0fr]"
                              }`}
                            >
                              <ul className="overflow-hidden ps-5">
                                {category.subcategories.map((sub) => (
                                  <li key={sub.id}>
                                    <Link
                                      href={localizedPath(
                                        locale,
                                        `${category.slug}/${sub.slug}`,
                                      )}
                                      className="block py-2.5 text-[14px] text-steel-light"
                                    >
                                      {localized(sub.name, locale)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : null}
                </Fragment>
              ))}
              {[...links, { label: nav.home, path: "" }].reverse().map((link) => (
                <li key={link.path || "home"}>
                  <Link
                    href={localizedPath(locale, link.path)}
                    className="block py-4 text-[15px] font-semibold tracking-[0.06em] uppercase"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 flex flex-col gap-3 border-t border-line-light pt-8">
            <Link href={localizedPath(locale, "contact")} className={btnClass("primaryDark")}>
              {common.requestConsultation}
            </Link>
            <Link
              href={switchLocalePath(pathname, other)}
              lang={other}
              className="btn btn-outline-light"
            >
              {other === "ar" ? common.arabic : common.english}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
