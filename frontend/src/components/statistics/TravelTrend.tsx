import { LineChart } from "@mui/x-charts";
import { useTravelTrendContext } from "../../contexts/TravelTrendContext";
import { useMemo } from "react";
import { Typography } from "@mui/material";

export default function TravelTrend() {
  const { travelTrend } = useTravelTrendContext();
  const travelTimes = useMemo(() => {
    if (travelTrend.length === 0) return [];
    return travelTrend[0].history.map(({ year, month }) => `${month}.${year}`);
  }, [travelTrend]);
  console.log(travelTrend);
  return travelTrend.length > 0 ? (
    <LineChart
      sx={{ width: "100%" }}
      height={300}
      series={travelTrend.map(({ region, history }) => ({
        data: history.map(({ count }) => count),
        label: region,
      }))}
      xAxis={[{ scaleType: "point", data: travelTimes }]}
    />
  ) : (
    <Typography>No region selected yet</Typography>
  );
}
