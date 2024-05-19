import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelectionContext } from "../../contexts/SelectionContext";
import ProductTrend from "./ProductTrend";
import TravelTrend from "./TravelTrend";
import RegionTrend from "./RegionTrend";
import TrendPrediction from "./TrendPrediction";

const SEASONS = [
  { name: "January", value: [1, 1] },
  { name: "Febuary", value: [2, 2] },
  { name: "March", value: [3, 3] },
  { name: "April", value: [4, 4] },
  { name: "May", value: [5, 5] },
  { name: "June", value: [6, 6] },
  { name: "July", value: [7, 7] },
  { name: "August", value: [8, 8] },
  { name: "September", value: [9, 9] },
  { name: "October", value: [10, 10] },
  { name: "November", value: [11, 11] },
  { name: "December", value: [12, 12] },
  { name: "Spring", value: [1, 3] },
  { name: "Summer", value: [4, 6] },
  { name: "Autumn", value: [7, 9] },
  { name: "Winter", value: [10, 12] },
  { name: "All seasons", value: [1, 12] },
];

const PERIODS = [1, 2, 3, 4, 5];

const categoryStyle = {
  boxShadow: "none",
  border: "2px solid #c7c7c7",
  borderRadius: "4px",
  width: "100%",
};

function encodeSeason(season: number[]) {
  return season[0] * 13 + season[1];
}

function decodeSeason(encoded: number) {
  const s = Math.floor(encoded / 13);
  const e = encoded % 13;
  return [s, e];
}

export default function Statistics() {
  const { season, setSeason, period, setPeriod, ageGroup, setAgeGroup } =
    useSelectionContext();

  const [expanding, setExpanding] = useState({
    product: true,
    travel: true,
    season: true,
  });
  const [ageRange, setAgeRange] = useState(ageGroup);
  const lastDebounceIdRef = useRef<any>(undefined);

  useEffect(() => {
    clearTimeout(lastDebounceIdRef.current);
    lastDebounceIdRef.current = setTimeout(() => setAgeGroup(ageRange), 250);
  }, [ageRange]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "45%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          maxWidth: "100%",
          maxHeight: "95%",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          padding: "10px 20px 0px 20px",
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            width: "100%",
          }}
        >
          <FormControl size="small" sx={{ width: "30%" }}>
            <InputLabel id="season-select-label">Season</InputLabel>
            <Select
              labelId="season-select-label"
              id="season-select"
              value={encodeSeason(season)}
              label="Season"
              onChange={(e) =>
                setSeason(decodeSeason(e.target.value as number))
              }
            >
              {SEASONS.map(({ name, value }) => (
                <MenuItem key={name} value={encodeSeason(value)}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: "30%" }}>
            <InputLabel id="period-select-label">Period</InputLabel>
            <Select
              labelId="period-select-label"
              id="period-select"
              value={period}
              label="Period"
              onChange={(e) => setPeriod(e.target.value as number)}
            >
              {PERIODS.map((period) => (
                <MenuItem key={period} value={period}>
                  Over {period} year(s)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              position: "relative",
              width: "40%",
              height: "37px",
            }}
          >
            <InputLabel
              sx={{
                position: "absolute",
                top: "-1.6ex",
                zIndex: 1,
                left: "0.7em",
                backgroundColor: "white",
                padding: "0 5px",
                fontSize: "12px",
              }}
            >
              Age Range
            </InputLabel>
            <Box
              sx={{
                border: "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Slider
                size="small"
                sx={{
                  width: "90%",
                  "& .MuiSlider-thumb": {
                    boxShadow: "0 0 2px 0px rgba(0, 0, 0, 0.1)",
                    "&:focus, &:hover, &.Mui-active": {
                      boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
                      "@media (hover: none)": {
                        boxShadow:
                          "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)",
                      },
                    },
                    "&:before": {
                      boxShadow:
                        "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)",
                    },
                  },
                }}
                getAriaLabel={() => "Age Range"}
                value={ageRange}
                onChange={(_, value) => setAgeRange(value as number[])}
                valueLabelDisplay="on"
                getAriaValueText={(age) => `${age} y/o`}
                //@ts-ignore
                components={{ ValueLabel: CustomTooltip }}
              />
            </Box>
          </Box>
        </Box>
        <Accordion
          disableGutters
          sx={{
            ...categoryStyle,
            mt: 3,
          }}
          onChange={() =>
            setExpanding((prev) => ({ ...prev, product: !prev.product }))
          }
          expanded={expanding.product}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <b>Product Trend</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ProductTrend />
          </AccordionDetails>
        </Accordion>
        <Accordion
          disableGutters
          sx={categoryStyle}
          onChange={() =>
            setExpanding((prev) => ({ ...prev, travel: !prev.travel }))
          }
          expanded={expanding.travel}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <b>Travel Trend</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TravelTrend />
          </AccordionDetails>
        </Accordion>
        <Accordion
          disableGutters
          sx={categoryStyle}
          onChange={() =>
            setExpanding((prev) => ({ ...prev, season: !prev.season }))
          }
          expanded={expanding.season}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <b>Season Trend</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RegionTrend />
          </AccordionDetails>
        </Accordion>
        <Divider sx={{ width: "100%", m: 1 }} />
        <TrendPrediction />
      </Box>
    </Box>
  );
}

const CustomTooltip = (props: any) => {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} placement="bottom" title={value}>
      {children}
    </Tooltip>
  );
};
