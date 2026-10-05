import { site } from "@/lib/site";
import type { Locale } from "@/i18n/config";

/**
 * Floating WhatsApp chat button, pinned to the bottom-end corner of every
 * page. Responsive: slightly smaller on mobile so it never crowds the
 * content, larger with a label-feel presence on desktop. Sits below the
 * header/mobile-menu z-index layers.
 */
export default function WhatsAppButton({ locale }: { locale: Locale }) {
  const label =
    locale === "ar" ? "گفتگو در واتس‌اپ" : "Chat with us on WhatsApp";

  return (
    <a
      href={`https://wa.me/${site.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-4 end-4 z-30 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-10px_rgba(18,60,46,0.7)] transition-transform duration-300 hover:scale-105 sm:bottom-6 sm:end-6 sm:h-15 sm:w-15"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-6 w-6 sm:h-7 sm:w-7"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.04 3C9.03 3 3.34 8.68 3.34 15.69c0 2.24.59 4.42 1.7 6.35L3.2 29l7.12-1.87a12.7 12.7 0 0 0 5.72 1.36h.01c7 0 12.7-5.69 12.7-12.7 0-3.39-1.32-6.58-3.72-8.98A12.6 12.6 0 0 0 16.04 3Zm0 23.4h-.01a10.6 10.6 0 0 1-5.39-1.48l-.39-.23-4.22 1.11 1.13-4.12-.25-.42a10.55 10.55 0 0 1-1.62-5.57c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.56 10.56 0 0 1 3.11 7.52c0 5.86-4.77 10.63-10.52 10.63Zm5.83-7.96c-.32-.16-1.95-.96-2.25-1.07-.3-.11-.52-.16-.74.16-.22.32-.85 1.07-1.04 1.29-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6a9.7 9.7 0 0 1-1.79-2.23c-.19-.32-.02-.5.14-.66.14-.14.32-.38.48-.57.16-.19.22-.32.32-.54.11-.22.05-.4-.03-.56-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.58.08-.88.4-.3.32-1.15 1.12-1.15 2.74 0 1.61 1.18 3.17 1.34 3.39.16.22 2.31 3.52 5.59 4.93.78.34 1.39.54 1.87.69.78.25 1.5.21 2.06.13.63-.09 1.95-.8 2.22-1.57.27-.77.27-1.43.19-1.57-.08-.14-.29-.22-.61-.38Z" />
      </svg>
    </a>
  );
}
