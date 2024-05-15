import { Box } from "@mui/material";
import RegionMap from "./components/map/Map";
import Statistics from "./components/statistics/Statistics";

export default function App() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        height: "100vh",
        width: "100vw",
      }}
    >
      <RegionMap />
      <Statistics />
    </Box>
  );
}
