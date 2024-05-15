import { useEffect, useMemo, useRef, useState } from "react";
import { FeatureGroup, Polygon, Tooltip, useMap } from "react-leaflet";
import { useSelectionContext } from "../../contexts/SelectionContext";
import REGIONS from "../../../regions.json";

function parseCoordinates(coordinates: any) {
  return coordinates.map(function t(e: any) {
    return typeof e[0] === "number" ? { lng: e[0], lat: e[1] } : e.map(t);
  });
}

export default function RegionMap() {
  const { regions, setRegions } = useSelectionContext();
  const allRegions = useMemo(
    () =>
      REGIONS.features.map(({ geometry, properties }) => ({
        name: properties.name,
        coordinates: parseCoordinates(geometry.coordinates),
      })),
    []
  );
  const featureGroupRef = useRef(null);
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      if (featureGroupRef.current) {
        //@ts-ignore
        map.fitBounds(featureGroupRef.current.getBounds());
      }
    }, 10);
  }, []);
  const [hovering, setHovering] = useState<{ [regionName: string]: boolean }>(
    {}
  );
  return (
    <FeatureGroup ref={featureGroupRef}>
      {allRegions.map(({ name, coordinates }) => (
        <Polygon
          key={name}
          positions={coordinates}
          eventHandlers={{
            mouseover: () => setHovering((prev) => ({ ...prev, [name]: true })),
            mouseout: () => setHovering((prev) => ({ ...prev, [name]: false })),
            click: () => {
              setRegions((prev) =>
                prev.includes(name)
                  ? prev.filter((region) => region !== name)
                  : [...prev, name]
              );
            },
          }}
          pathOptions={{
            fillColor: regions.includes(name) ? "red" : "yellow",
            fillOpacity: hovering[name] ? 0.5 : 0.2,
            weight: hovering[name] ? 2 : 1,
            stroke: true,
          }}
        >
          <Tooltip sticky>
            <b>{name}</b>
          </Tooltip>
        </Polygon>
      ))}
    </FeatureGroup>
  );
}
