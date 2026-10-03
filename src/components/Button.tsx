import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "primaryDark" | "outlineLight" | "outlineDark";

export function btnClass(variant: ButtonVariant = "primary", size: "md" | "sm" = "md") {
  const sizeClass = size === "sm" ? "btn-sm" : "";
  return `btn btn-${variant} ${sizeClass}`;
}

export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: "md" | "sm";
  children: ReactNode;
  className?: string;
};

export default function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  children,
  className = "",
}: ButtonLinkProps) {
  return (
    <Link href={href} className={`${btnClass(variant, size)} ${className}`}>
      {children}
    </Link>
  );
}
