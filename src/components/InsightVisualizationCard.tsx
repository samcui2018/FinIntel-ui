// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   BarChart,
//   Bar,
//   Legend,
//   Cell,
// } from "recharts";
// import type { InsightVisualization } from "../types/analytics";

// type Props = {
//   visualization?: InsightVisualization | null;
// };

// type ChartRow = {
//   label: string;
//   isHighlighted: boolean;
//   [key: string]: string | number | boolean;
// };

// function toChartData(visualization: InsightVisualization): ChartRow[] {
//   return visualization.labels.map((label, index) => {
//     const row: ChartRow = {
//       label,
//       isHighlighted: visualization.highlightIndexes.includes(index),
//     };

//     for (const series of visualization.series) {
//       row[series.name] = series.values[index] ?? 0;
//     }

//     return row;
//   });
// }

// export default function InsightVisualizationCard({ visualization }: Props) {
//   if (!visualization || visualization.series.length === 0) {
//     return null;
//   }

//   const data = toChartData(visualization);

//   return (
//     <div className="mt-4 rounded-xl border bg-white p-4">
//       {visualization.title ? (
//         <h4 className="mb-3 text-sm font-semibold text-slate-700">
//           {visualization.title}
//         </h4>
//       ) : null}

//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           {visualization.chartType === "line" ? (
//             <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="label" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             {visualization.series.map((series) => (
//                 <Line
//                 key={series.name}
//                 type="monotone"
//                 dataKey={series.name}
//                 stroke="#2563eb"
//                 strokeWidth={2}
//                 dot={(props: any) => {
//                     const { cx, cy, payload } = props;
//                     const isHighlighted = Boolean(payload?.isHighlighted);

//                     return (
//                     <circle
//                         cx={cx}
//                         cy={cy}
//                         r={isHighlighted ? 6 : 4}
//                         fill={isHighlighted ? "#dc2626" : "#2563eb"}
//                         stroke="white"
//                         strokeWidth={2}
//                     />
//                     );
//                 }}
//                 />
//             ))}
//             </LineChart>
//           ) : 
//           (
//             <BarChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="label" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {visualization.series.map((series) => (
//                 <Bar
//                   key={series.name}
//                   dataKey={series.name}
//                   radius={[6, 6, 0, 0]}
//                 >
//                   {data.map((entry, index) => (
//                     <Cell
//                       key={`${series.name}-${index}`}
//                       fill={entry.isHighlighted ? "#dc2626" : "#2563eb"}
//                     />
//                   ))}
//                 </Bar>
//               ))}
//             </Bar>
//           )}
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
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
  console.log("Chart data:", data);

  return (
    <div className="mt-4 rounded-xl border bg-white p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-700">
        {visualization.title ?? "Chart"}
      </h4>

      <div style={{ width: "100%", height: 320, minWidth: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={visualization.series[0].name}
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}