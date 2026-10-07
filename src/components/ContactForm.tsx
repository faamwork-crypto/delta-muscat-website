"use client";

import { useRef, useState, type FormEvent } from "react";
import { btnClass } from "@/components/Button";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * Consultation request form. On the production host it POSTs to
 * /contact.php, which emails the request to the company's info@ mailbox.
 * If the endpoint is unavailable (e.g. preview builds), it falls back to
 * opening the visitor's email application with the request pre-filled.
 */
export default function ContactForm({
  dict,
  email,
}: {
  dict: Dictionary["contact"]["form"];
  email: string;
}) {
  const [status, setStatus] = useState<"idle" | "sent-server" | "sent-mailto">("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const field =
    "w-full rounded-[2px] border border-line bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-steel/70 transition-colors focus:border-bronze focus:outline-none";
  const label = "mb-2 block text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (!name || !phone) {
      setError(dict.validation);
      return;
    }
    setError("");

    const need = String(data.get("need") ?? "");
    const projectType = String(data.get("projectType") ?? "");
    const location = String(data.get("location") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();

    const subject = `Consultation request — ${need || "General"} — ${name}`;
    const lines = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      from ? `Email: ${from}` : "",
      `What do you need: ${need}`,
      `Project type: ${projectType}`,
      location ? `Project location: ${location}` : "",
      "",
      "About the space:",
      message,
    ].filter(Boolean);

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(lines.join("\n"))}`;

    // Try the server-side endpoint first (production host); it emails the
    // request to info@ directly. Anything else falls back to the mailto flow.
    try {
      data.set("website", ""); // honeypot expected empty by contact.php
      const r = await fetch("contact.php", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const json = await r.json().catch(() => null);
      if (r.ok && json?.ok) {
        setStatus("sent-server");
        form.reset();
        return;
      }
    } catch {
      // endpoint unreachable — fall back below
    }

    setStatus("sent-mailto");
    window.location.href = mailto;
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>
            {dict.fullName} <span className="text-bronze">*</span>
          </label>
          <input id="cf-name" name="name" type="text" autoComplete="name" required className={field} />
        </div>
        <div>
          <label htmlFor="cf-phone" className={label}>
            {dict.phone} <span className="text-bronze">*</span>
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            required
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-email" className={label}>
          {dict.email}
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          dir="ltr"
          className={field}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-need" className={label}>
            {dict.need}
          </label>
          <select id="cf-need" name="need" className={field} defaultValue={dict.needOptions[0]}>
            {dict.needOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cf-type" className={label}>
            {dict.projectType}
          </label>
          <select
            id="cf-type"
            name="projectType"
            className={field}
            defaultValue={dict.projectTypeOptions[0]}
          >
            {dict.projectTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cf-location" className={label}>
          {dict.location}
        </label>
        <input
          id="cf-location"
          name="location"
          type="text"
          placeholder={dict.locationPlaceholder}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className={label}>
          {dict.message}
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          placeholder={dict.messagePlaceholder}
          className={`${field} resize-y`}
        />
      </div>

      {error ? (
        <p role="alert" className="text-[14px] font-medium text-bronze-ink">
          {error}
        </p>
      ) : null}

      {status === "sent-server" ? (
        <p
          role="status"
          className="border-s-2 border-bronze bg-paper-deep px-4 py-3 text-[14px] leading-relaxed text-ink-soft"
        >
          <strong className="font-semibold text-ink">{dict.serverSuccessTitle}. </strong>
          {dict.serverSuccessText}
        </p>
      ) : null}

      {status === "sent-mailto" ? (
        <p
          role="status"
          className="border-s-2 border-bronze bg-paper-deep px-4 py-3 text-[14px] leading-relaxed text-ink-soft"
        >
          <strong className="font-semibold text-ink">{dict.successTitle}. </strong>
          {dict.successText.replace("{email}", email)}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        <button type="submit" className={`${btnClass("primary")} justify-self-start`}>
          {dict.submit}
        </button>
        <p className="max-w-xl text-[13px] leading-relaxed text-steel">
          <strong className="font-semibold text-ink-soft">{dict.noteTitle}: </strong>
          {dict.noteText}
        </p>
      </div>
    </form>
  );
}
