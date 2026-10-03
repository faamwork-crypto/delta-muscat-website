import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string }>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata(locale, dict.meta.contact);
}

export default async function ContactPage({ params }: { params: Params }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const c = dict.contact;
  const info = c.info;

  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

      <section className="section-pad bg-paper">
        <div className="container-site grid gap-14 lg:grid-cols-[7fr_4fr] lg:gap-16">
          {/* Form */}
          <Reveal>
            <ContactForm dict={c.form} email={site.email} />
          </Reveal>

          {/* Contact details */}
          <Reveal delay={120}>
            <aside className="border border-line bg-paper-deep p-7 lg:sticky lg:top-32">
              <h2 className="text-[11px] font-semibold tracking-[0.22em] text-bronze-ink uppercase">
                {info.title}
              </h2>

              <dl className="mt-6 space-y-5 text-[14px] leading-relaxed">
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-steel uppercase">
                    {info.headOffice}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={site.headOfficePhoneHref}
                      dir="ltr"
                      className="font-medium text-ink transition-colors hover:text-bronze-ink"
                    >
                      {site.headOfficePhone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-steel uppercase">
                    {info.factory}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={site.factoryPhoneHref}
                      dir="ltr"
                      className="font-medium text-ink transition-colors hover:text-bronze-ink"
                    >
                      {site.factoryPhone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-steel uppercase">
                    {info.email}
                  </dt>
                  <dd className="mt-1 break-all">
                    <a
                      href={site.emailHref}
                      dir="ltr"
                      className="font-medium text-ink transition-colors hover:text-bronze-ink"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-steel uppercase">
                    {info.factoryAddressLabel}
                  </dt>
                  <dd className="mt-1 text-ink-soft">{site.factoryAddress}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-steel uppercase">
                    {info.mailingAddressLabel}
                  </dt>
                  <dd className="mt-1 text-ink-soft">{site.mailingAddress}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-steel uppercase">
                    {info.crLabel}
                  </dt>
                  <dd className="mt-1 font-medium text-ink" dir="ltr">
                    {site.crNumber}
                  </dd>
                </div>
              </dl>

              <div className="mt-7 border-t border-line pt-6">
                <p className="text-[13px] leading-relaxed text-steel">
                  <strong className="font-semibold text-ink-soft">{c.form.noteTitle}: </strong>
                  {c.form.noteText}
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
