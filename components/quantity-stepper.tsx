"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";

export function QuantityStepper({
  qty,
  onChange,
  small = false,
}: {
  qty: number;
  onChange: (qty: number) => void;
  small?: boolean;
}) {
  const btn = `flex items-center justify-center rounded-full glass text-cream-50 hover:bg-white/10 active:scale-95 transition ${
    small ? "h-7 w-7" : "h-9 w-9"
  }`;
  return (
    <div className="flex items-center gap-2.5">
      <button
        aria-label="Decrease quantity"
        className={btn}
        onClick={() => onChange(qty - 1)}
      >
        <MinusIcon width={14} height={14} />
      </button>
      <span
        className={`min-w-5 text-center tabular-nums ${small ? "text-sm" : ""}`}
      >
        {qty}
      </span>
      <button
        aria-label="Increase quantity"
        className={btn}
        onClick={() => onChange(qty + 1)}
      >
        <PlusIcon width={14} height={14} />
      </button>
    </div>
  );
}
