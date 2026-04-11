import type { StoredInsight } from "../types/analytics";
export function getPriorityBadge(score?: number | null) {
  const value = score ?? 0;

  if (value >= 320) {
    return {
      label: "Critical",
      background: "#7f1d1d",
      color: "#ffffff",
    };
  }

  if (value >= 300) {
    return {
      label: "High Priority",
      background: "#fee2e2",
      color: "#991b1b",
    };
  }

  if (value >= 220) {
    return {
      label: "Medium Priority",
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  return {
    label: "Low Priority",
    background: "#dbeafe",
    color: "#1d4ed8",
  };
}
// export function InfoBlock({
//   label,
//   value,
//   dark = false,
// }: {
//   label: string;
//   value: string;
//   dark?: boolean;
// }) {
//   return (
//     <div
//       style={{
//         padding: 12,
//         borderRadius: 10,
//         background: dark ? "rgba(255,255,255,0.08)" : "#f9fafb",
//       }}
//     >
//       <div
//         style={{
//           fontSize: 12,
//           color: dark ? "rgba(255,255,255,0.7)" : "#6b7280",
//           marginBottom: 4,
//         }}
//       >
//         {label}
//       </div>
//       <div style={{ fontWeight: 700 }}>{value}</div>
//     </div>
//   );
// }
export function getSeverityPillStyle(severity: string): React.CSSProperties {
  switch (severity?.toLowerCase()) {
    case "high":
      return {
        backgroundColor: "#fff5f5",
        border: "1px solid #f5c2c7",
        color: "#842029",
      };
    case "medium":
      return {
        backgroundColor: "#fff8e1",
        border: "1px solid #ffecb5",
        color: "#664d03",
      };
    default:
      return {
        backgroundColor: "#f0f9ff",
        border: "1px solid #b6effb",
        color: "#055160",
      };
  }
}
export function formatCurrency(value: number, currencyCode = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

export function formatNullableCurrency(
  value: number | null | undefined,
  currencyCode = "USD"
): string {
  if (value == null) return "—";
  return formatCurrency(value, currencyCode);
}

export function formatDate(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

export function formatInsightType(value: string): string {
  if (!value) return "Insight";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getSeverityStyles(severity: string): React.CSSProperties {
  switch (severity?.toLowerCase()) {
    case "high":
      return {
        backgroundColor: "#fff5f5",
        border: "1px solid #f5c2c7",
        color: "#842029",
      };
    case "medium":
      return {
        backgroundColor: "#fff8e1",
        border: "1px solid #ffecb5",
        color: "#664d03",
      };
    default:
      return {
        backgroundColor: "#f0f9ff",
        border: "1px solid #b6effb",
        color: "#055160",
      };
  }
}

export function sortInsights(items: StoredInsight[]): StoredInsight[] {
  const severityRank: Record<string, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...items].sort((a, b) => {
    const severityDiff =
      (severityRank[b.severity?.toLowerCase()] ?? 0) -
      (severityRank[a.severity?.toLowerCase()] ?? 0);

    if (severityDiff !== 0) return severityDiff;

    const aDate = new Date(a.createdAtUtc ?? 0).getTime();
    const bDate = new Date(b.createdAtUtc ?? 0).getTime();

    return bDate - aDate;
  });
}