import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { InsightVisualization } from "../types/analytics";

type Props = {
  visualization?: InsightVisualization | null;
};

type ChartRow = {
  label: string;
  [key: string]: string | number;
};

function toChartData(visualization: InsightVisualization): ChartRow[] {
  return visualization.labels.map((label, index) => {
    const row: ChartRow = { label };

    for (const series of visualization.series) {
      row[series.name] = series.values[index] ?? 0;
    }

    return row;
  });
}

function getChartType(visualization: InsightVisualization): string {
  return (
    (visualization as InsightVisualization & { type?: string; chartType?: string })
      .chartType ??
    (visualization as InsightVisualization & { type?: string; chartType?: string })
      .type ??
    "line"
  );
}

const PIE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#ea580c",
  "#4f46e5",
];

export default function InsightVisualizationCard({ visualization }: Props) {
  console.log("InsightVisualizationCard visualization:", visualization);

  if (!visualization) {
    return <div className="mt-4 text-sm text-red-600">No visualization object</div>;
  }

  if (!visualization.labels?.length) {
    return <div className="mt-4 text-sm text-red-600">No labels</div>;
  }

  if (!visualization.series?.length) {
    return <div className="mt-4 text-sm text-red-600">No series</div>;
  }

  const data = toChartData(visualization);
  const chartType = getChartType(visualization);
  const firstSeriesName = visualization.series[0].name;

  const pieData = visualization.labels.map((label, index) => ({
    name: label,
    value: visualization.series[0].values[index] ?? 0,
  }));

  console.log("Chart data:", data);
  console.log("Pie data:", pieData);
  console.log("Chart type:", chartType);

  return (
    <div className="chart-container">
      <h4 className="mb-3 text-sm font-semibold text-slate-700">
        {visualization.title ?? "Chart"}
      </h4>

      {/* style={{ width: "100%", height: 320, minWidth: 300 }} */}
      <div style={{ width: "100%", height: 320, minWidth: 300 }} >
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "pie" ? (
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={firstSeriesName}
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";
// import type { InsightVisualization } from "../types/analytics";

// type Props = {
//   visualization?: InsightVisualization | null;
// };

// type ChartRow = {
//   label: string;
//   [key: string]: string | number;
// };

// function toChartData(visualization: InsightVisualization): ChartRow[] {
//   return visualization.labels.map((label, index) => {
//     const row: ChartRow = { label };

//     for (const series of visualization.series) {
//       row[series.name] = series.values[index] ?? 0;
//     }

//     return row;
//   });
// }

// export default function InsightVisualizationCard({ visualization }: Props) {
//   console.log("InsightVisualizationCard visualization:", visualization);

//   if (!visualization) {
//     return <div className="mt-4 text-sm text-red-600">No visualization object</div>;
//   }

//   if (!visualization.labels?.length) {
//     return <div className="mt-4 text-sm text-red-600">No labels</div>;
//   }

//   if (!visualization.series?.length) {
//     return <div className="mt-4 text-sm text-red-600">No series</div>;
//   }

//   const data = toChartData(visualization);
//   console.log("Chart data:", data);

//   return (
//     <div className="mt-4 rounded-xl border bg-white p-4">
//       <h4 className="mb-3 text-sm font-semibold text-slate-700">
//         {visualization.title ?? "Chart"}
//       </h4>

//       <div style={{ width: "100%", height: 320, minWidth: 300 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="label" />
//             <YAxis />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey={visualization.series[0].name}
//               stroke="#2563eb"
//               strokeWidth={2}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }