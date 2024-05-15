import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelectionContext } from "./SelectionContext";

type RegionTrend = { name: string; count: number };

type RegionTrendContextType = {
  regionTrend: RegionTrend[];
};

const RegionTrendContext = createContext<RegionTrendContextType>({
  regionTrend: [],
});

export default function RegionTrendProvider(props: { children: ReactNode }) {
  const { regions, season, period, ageGroup } = useSelectionContext();
  const [regionTrend, setRegionTrend] = useState<RegionTrend[]>([]);
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "";
    if (regions.length === 0) setRegionTrend([]);
    else if (serverUrl) {
      fetch(serverUrl + "/trend/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regions, season, period, age_group: ageGroup }),
      }).then(async (response) => {
        if (response.status < 400) {
          const responseBody = await response.json();
          setRegionTrend(
            Object.entries<number>(responseBody).map(([key, value]) => ({
              name: key,
              count: value,
            }))
          );
        }
      });
    }
  }, [regions, season, period, ageGroup]);
  return (
    <RegionTrendContext.Provider value={{ regionTrend }}>
      {props.children}
    </RegionTrendContext.Provider>
  );
}

export function useRegionTrendContext() {
  return useContext(RegionTrendContext);
}
