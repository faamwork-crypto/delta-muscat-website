import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import SolutionsGrid from "@/components/home/SolutionsGrid";
import WhyDelta from "@/components/home/WhyDelta";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ProcessSection from "@/components/home/ProcessSection";
import MaterialsSection from "@/components/home/MaterialsSection";
import SectorsSection from "@/components/home/SectorsSection";
import CtaBanner from "@/components/home/CtaBanner";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata(locale, dict.meta.home);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <Intro locale={locale} dict={dict} />
      <SolutionsGrid locale={locale} dict={dict} />
      <WhyDelta dict={dict} />
      <FeaturedProjects locale={locale} dict={dict} />
      <ProcessSection locale={locale} dict={dict} />
      <MaterialsSection locale={locale} dict={dict} />
      <SectorsSection locale={locale} dict={dict} />
      <CtaBanner locale={locale} dict={dict} />
    </>
  );
}
