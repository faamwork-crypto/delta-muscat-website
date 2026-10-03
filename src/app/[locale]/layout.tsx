import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/i18n/get-dictionary";
import { dir, isLocale, locales, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  applicationName: site.name,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const dict = await getDictionary(locale);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    alternateName: "Delta Muscat",
    description: dict.meta.home.description,
    email: site.email,
    telephone: site.headOfficePhone,
    faxNumber: site.fax,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Road 11, Rusayl Industrial City",
      addressLocality: "Muscat",
      addressCountry: "OM",
      postOfficeBoxNumber: "134",
      postalCode: "134",
    },
    identifier: `CR ${site.crNumber}`,
  };

  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
      <body className="bg-paper font-sans text-ink antialiased">
        <a href="#main-content" className="skip-link">
          {dict.nav.skipToContent}
        </a>
        <Header locale={locale} nav={dict.nav} common={dict.common} />
        <main id="main-content">{children}</main>
        <Footer locale={locale} dict={dict} />
        <JsonLd data={organization} />
      </body>
    </html>
  );
}
