import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`glass rounded-3xl ${className}`}>{children}</div>;
}

const pillBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none";

const pillVariants = {
  primary:
    "bg-cream-50 text-forest-900 hover:bg-cream-100 active:scale-[0.98] shadow-lg shadow-black/20",
  glass: "glass text-cream-50 hover:bg-white/10 active:scale-[0.98]",
  gold: "bg-gold-400 text-forest-950 hover:bg-gold-300 active:scale-[0.98]",
} as const;

type PillVariant = keyof typeof pillVariants;

export function PillButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: PillVariant;
}) {
  return (
    <button
      className={`${pillBase} ${pillVariants[variant]} px-6 py-3 text-sm ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PillLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: PillVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${pillBase} ${pillVariants[variant]} px-6 py-3 text-sm ${className}`}
    >
      {children}
    </Link>
  );
}
