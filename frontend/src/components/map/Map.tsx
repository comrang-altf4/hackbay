import { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Autocomplete, TextField } from "@mui/material";
import RegionMap from "./RegionMap";
import { useSelectionContext } from "../../contexts/SelectionContext";
import REGIONS from "../../../regions.json";

export default function Map() {
  const { regions, setRegions } = useSelectionContext();
  const allRegionNames = useMemo(
    () => REGIONS.features.map(({ properties }) => properties.name),
    []
  );
  return (
    <MapContainer
      dragging={false}
      scrollWheelZoom={false}
      style={{ width: "55%", height: "100%" }}
    >
      <Autocomplete
        size="small"
        sx={{
          position: "relative",
          width: "300px",
          zIndex: 10000,
          marginLeft: "65%",
          right: "20px",
          top: "10px",
          backgroundColor: "white",
          borderRadius: "4px",
        }}
        disableCloseOnSelect
        multiple
        value={regions}
        onChange={(_, e) => setRegions(e)}
        options={allRegionNames}
        renderInput={(params) => <TextField {...params} label="Regions" />}
      />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RegionMap />
    </MapContainer>
  );
}
