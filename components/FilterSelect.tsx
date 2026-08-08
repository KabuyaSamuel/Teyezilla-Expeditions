"use client";

import { useRouter } from "next/navigation";

// A URL-driven <select> for listing-page filters that have (or will grow
// to have) too many options to lay out as a row of pills -- picking a value
// navigates to that option's href, same end result as clicking a pill link,
// just collapsed behind a dropdown so the row of filters above the results
// stays a fixed height as more options get added over time.
export default function FilterSelect({
  value,
  options,
  ariaLabel,
}: {
  value: string;
  options: { value: string; label: string; href: string }[];
  ariaLabel: string;
}) {
  const router = useRouter();

  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => {
        const option = options.find((o) => o.value === e.target.value);
        if (option) router.push(option.href);
      }}
      className="rounded-full border border-secondary/40 bg-white px-4 py-2 text-sm font-medium text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
