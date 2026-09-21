import { daysSince } from "../utils/format";

/**
 * Small pill showing how long ago a hand-maintained figure was last refreshed.
 * Colour shifts neutral → amber → red as the data ages, so staleness is visible
 * at a glance instead of buried in a footnote. Purely presentational — actually
 * refreshing the data still means editing the source file and bumping `asOf`.
 */
export default function FreshnessBadge({ asOf, label = "This data" }) {
  const days = daysSince(asOf);
  const tone = days > 120 ? "var(--clot-lift)" : days > 45 ? "var(--serum)" : "var(--oxygen)";
  const when = new Date(`${asOf}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <span
      className="tag"
      style={{ borderColor: tone, color: tone, flexShrink: 0 }}
      title={`${label} last refreshed by hand on ${when}. This section reads a static file, not a live API — update src/data/variants.js and bump SURVEILLANCE.asOf to move this badge.`}
    >
      {days === 0 ? "updated today" : `updated ${days}d ago`}
    </span>
  );
}
