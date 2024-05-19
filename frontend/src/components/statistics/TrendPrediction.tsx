import { LineChart } from "@mui/x-charts";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTrendPredictionContext } from "../../contexts/TrendPredictionContext";
import { useState } from "react";

const current = new Date();

export default function TrendPrediction() {
  const { areas, predictions, getPredictions } = useTrendPredictionContext();
  const [area, setArea] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography>Future Trend Prediction</Typography>
        <FormControl size="small" sx={{ width: "30%" }}>
          <InputLabel id="area-select-label">Area</InputLabel>
          <Select
            labelId="area-select-label"
            id="area-select"
            value={area}
            label="Season"
            onChange={(e) => {
              const v = e.target.value;
              setArea(v);
              getPredictions(v);
            }}
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
              (_, i) => new Date(current.getTime() + 86400000 * i)
            ),
          },
        ]}
      />
    </Box>
  );
}
