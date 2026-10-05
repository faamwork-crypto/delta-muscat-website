/**
 * Internal link registry (فایل داخلی لینک‌ها).
 *
 * همه‌ی لینک‌های خارجی مرجع در همین فایل نگه‌داری می‌شوند تا در یک نقطه
 * قابل ویرایش باشند. برای افزودن لینک جدید، یک آیتم به آرایه‌ی مربوطه
 * اضافه کنید؛ برای نمایش روی سایت، همان آرایه را در کامپوننت مورد نظر
 * رندر کنید. (این فایل روی سایت عمومی نیست مگر آنکه در صفحه‌ای استفاده شود.)
 */

export type ExternalLink = {
  id: string;
  /** نمایش روی سایت (معمولاً نام برند). */
  label: string;
  href: string;
  /** تصویر نمونه (BASE-prefixed) — بالای کارت لینک نمایش داده می‌شود. */
  image?: string;
  /** توضیح داخلی — روی سایت نمایش داده نمی‌شود. */
  note?: string;
};

const withBase = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;

/** برندهای پارچه‌ی فنی مورد استفاده — در صفحه Materials نمایش داده می‌شود. */
export const fabricBrandLinks: ExternalLink[] = [
  {
    id: "serge-ferrari",
    label: "Serge Ferrari",
    href: "https://www.sergeferrari-group.com/",
    image: withBase("/images/brands/serge-ferrari.webp"),
    note: "فرانسه — پارچه‌های Precontraint و Stamoid (دریایی)؛ نمونه‌ای از آن: لینک مرجع Stamoid در referenceLinks. عکس: سایت رسمی برند.",
  },
  {
    id: "mehler",
    label: "Mehler",
    href: "https://www.mehlerheytex.com/en",
    image: withBase("/images/brands/mehler.webp"),
    note: "آلمان (MehlerHeytex) — پارچه‌های VALMEX برای معماری کششی. عکس: سایت رسمی برند.",
  },
  {
    id: "sioen",
    label: "Sioen",
    href: "https://sioentensilearchitecture.com/",
    image: withBase("/images/brands/sioen.webp"),
    note: "بلژیک — غشاهای معماری کششی (FluoMax و…). نام «Sieo» در درخواست کاربر، همین Sioen است. عکس: سایت رسمی برند.",
  },
];

/** لینک‌های مرجع داخلی — فقط در همین فایل ذخیره می‌شوند و روی سایت رندر نمی‌شوند. */
export const referenceLinks: ExternalLink[] = [
  {
    id: "serge-ferrari-stamoid-amazon",
    label: "Serge Ferrari Stamoid Top 80 — marine fabric (reference listing)",
    href: "https://www.amazon.com/dp/B07P67DQS5",
    note: "لینکی که کاربر به‌عنوان نمونه پارچه فرستاد (share.google → آمازون).",
  },
];
