import type { TopInsightCardModel } from "../types/analytics";

function FeaturedInsight({ insight }: { insight: TopInsightCardModel }) {
  const priority = getPriorityBadge(insight.score);

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        background: "#111",
        color: "white",
        boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7, letterSpacing: 1 }}>
        TOP OPPORTUNITY
      </div>

      <div style={{ marginTop: 10 }}>
        <span
          style={{
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            background: priority.background,
            color: priority.color,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {priority.label}
        </span>
      </div>

      <h3 style={{ margin: "12px 0 8px" }}>{insight.title}</h3>

      <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.5 }}>
        {insight.description}
      </p>

      <div style={{ marginTop: 16, fontSize: 24, fontWeight: 700 }}>
        ${insight.estimatedImpact?.toLocaleString() ?? "—"}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 8,
        }}
      >
        <strong>Severity:</strong> {insight.severity}
      </div>

      {insight.recommendation && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 8,
          }}
        >
          <strong>Recommended:</strong> {insight.recommendation}
        </div>
      )}
    </div>
  );
}

// function FeaturedInsight({ insight }: { insight: TopInsightCardModel }) {
//   return (
//     <div
//       style={{
//         padding: 20,
//         borderRadius: 12,
//         background: "#111",
//         color: "white",
//         boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
//       }}
//     >
//       <div style={{ fontSize: 12, opacity: 0.7 }}>TOP OPPORTUNITY</div>

//       <h3 style={{ margin: "8px 0" }}>{insight.title}</h3>

//       <p style={{ opacity: 0.9 }}>{insight.description}</p>

//       <div style={{ marginTop: 12, fontSize: 20 }}>
//         💰 ${insight.estimatedImpact?.toLocaleString() ?? "—"}
//       </div>

//       {insight.recommendation && (
//         <div
//           style={{
//             marginTop: 12,
//             padding: 12,
//             background: "rgba(255,255,255,0.1)",
//             borderRadius: 8,
//           }}
//         >
//           <strong>Recommended:</strong> {insight.recommendation}
//         </div>
//       )}

//       <button
//         style={{
//           marginTop: 16,
//           padding: "10px 14px",
//           borderRadius: 8,
//           border: "none",
//           cursor: "pointer",
//         }}
//       >
//         Take Action →
//       </button>
//     </div>
//   );
// }