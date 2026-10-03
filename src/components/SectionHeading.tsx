import Reveal from "@/components/Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  tone?: "light" | "dark";
  align?: "start" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light",
  align = "start",
  className = "",
}: SectionHeadingProps) {
  const isDark = tone === "dark";
  return (
    <Reveal
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      <p
        className={`eyebrow ${align === "center" ? "justify-center" : ""} ${
          isDark ? "text-bronze-soft" : "text-bronze-ink"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className={`display-1 mt-5 ${isDark ? "text-paper" : "text-ink"}`}>{title}</h2>
      {lead ? (
        <p className={`lead mt-5 ${isDark ? "text-steel-light" : "text-ink-soft"}`}>{lead}</p>
      ) : null}
    </Reveal>
  );
}
