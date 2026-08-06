import { StarIcon } from "@/components/icons";

/** Five stars with the average clipped across them, so 4.8 reads as 4.8 rather
 *  than rounding to 5. The numeric value is what screen readers get. */
export function StarRating({
  value,
  count,
  size = 16,
}: {
  value: number;
  count?: number;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className="inline-flex items-center gap-2"
      role="img"
      aria-label={
        count === undefined
          ? `Rated ${value} out of 5`
          : `Rated ${value} out of 5, from ${count} ratings`
      }
    >
      <span className="relative inline-flex" aria-hidden>
        <span className="flex gap-0.5 text-sage-400/40">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} width={size} height={size} />
          ))}
        </span>
        <span
          className="absolute inset-0 flex gap-0.5 overflow-hidden text-gold-300"
          style={{ width: `${pct}%` }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} width={size} height={size} className="shrink-0" />
          ))}
        </span>
      </span>
    </span>
  );
}
