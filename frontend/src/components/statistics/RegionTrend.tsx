import { PieChart } from "@mui/x-charts";
import { useRegionTrendContext } from "../../contexts/RegionTrendContext";
import { Typography } from "@mui/material";

export default function RegionTrend() {
  const { regionTrend } = useRegionTrendContext();
  return regionTrend.length > 0 ? (
    <PieChart
      series={[
        {
          data: regionTrend.map(({ name, count }) => ({
            id: name,
            value: count,
            label: name,
          })),
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 10, additionalRadius: -10, color: "gray" },
        },
      ]}
      height={300}
    />
  ) : (
    <Typography>No region selected yet</Typography>
  );
}
