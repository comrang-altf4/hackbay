import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useTrendPredictionContext } from "../../contexts/TrendPredictionContext";
import Months from "../../utils/month-mapping";

export default function TrendPrediction() {
  const { areas, predictions, getPredictions } = useTrendPredictionContext();
  const [area, setArea] = useState("");
  useEffect(() => setArea(areas[0]), [areas]);
  useEffect(() => getPredictions(area), [area]);

  console.log(predictions.forecast.map((_, i) => `${Months[i % 12]}`));

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography>
          <b>Future Trend Prediction</b>
        </Typography>
        <FormControl size="small" sx={{ width: "30%" }}>
          <InputLabel id="area-select-label">Area</InputLabel>
          <Select
            labelId="area-select-label"
            id="area-select"
            value={area}
            label="Season"
            onChange={(e) => setArea(e.target.value)}
          >
            {areas.map((area) => (
              <MenuItem key={area} value={area}>
                {area}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <LineChart
        sx={{ width: "100%" }}
        height={300}
        series={[
          {
            data: predictions.history,
            label: "history",
          },
          {
            data: predictions.forecast,
            label: "forecast",
          },
        ]}
        xAxis={[
          {
            scaleType: "point",
            data: predictions.forecast.map(
              (_, i) => `${Months[i % 12]}(${Math.floor(i / 12)})`
            ),
          },
        ]}
      />
    </Box>
  );
}
