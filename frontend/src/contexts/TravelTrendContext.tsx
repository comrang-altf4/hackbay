import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelectionContext } from "./SelectionContext";

type History = {
  month: number;
  year: number;
  count: number;
};

type TravelTrend = {
  region: string;
  history: History[];
};

type TravelTrendContextType = {
  travelTrend: TravelTrend[];
};

const TravelTrendContext = createContext<TravelTrendContextType>({
  travelTrend: [],
});

export default function TravelTrendProvider(props: { children: ReactNode }) {
  const { regions, season, period, ageGroup } = useSelectionContext();
  const [travelTrend, setTravelTrend] = useState<TravelTrend[]>([]);
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "";
    if (regions.length === 0) setTravelTrend([]);
    else if (serverUrl) {
      fetch(serverUrl + "/trend/travels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regions, season, period, age_group: ageGroup }),
      }).then(async (response) => {
        if (response.status < 400) {
          const responseBody = await response.json();
          console.log(responseBody);
          setTravelTrend(
            Object.entries<any>(responseBody).map(([region, value]) => {
              const history = (value as any[]).map(
                ({ Year, Month, SalesCount }) => ({
                  year: Year,
                  month: Month,
                  count: SalesCount,
                })
              );
              return { region, history };
            })
          );
        }
      });
    }
  }, [regions, season, period, ageGroup]);
  return (
    <TravelTrendContext.Provider value={{ travelTrend }}>
      {props.children}
    </TravelTrendContext.Provider>
  );
}

export function useTravelTrendContext() {
  return useContext(TravelTrendContext);
}
