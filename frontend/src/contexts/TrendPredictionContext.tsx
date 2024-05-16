import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type PredictionContextType = {
  history: number[];
  forecast: number[];
};

type TrendPredictionContextType = {
  areas: string[];
  predictions: PredictionContextType;
  getPredictions: (area: string) => void;
};

const TrendPredictionContext = createContext<TrendPredictionContextType>({
  areas: [],
  predictions: {
    history: [],
    forecast: [],
  },
  getPredictions: () => {},
});

export default function TrendPredictionProvider(props: {
  children: ReactNode;
}) {
  const [areas, setAreas] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<PredictionContextType>({
    history: [],
    forecast: [],
  });
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "";
    if (serverUrl) {
      fetch(serverUrl + "/areas", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(async (response) => {
        if (response.status < 400) {
          const responseBody = await response.json();
          setAreas(responseBody);
        }
      });
    }
  }, []);

  const getPredictions = (area: string) => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "";
    if (serverUrl) {
      fetch(serverUrl + "/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Sales_area: area }),
      }).then(async (response) => {
        if (response.status < 400) {
          const responseBody = await response.json();
          setPredictions({
            history: responseBody.history,
            forecast: responseBody.forecast,
          });
        }
      });
    }
  };
  return (
    <TrendPredictionContext.Provider
      value={{ areas, predictions, getPredictions }}
    >
      {props.children}
    </TrendPredictionContext.Provider>
  );
}

export function useTrendPredictionContext() {
  return useContext(TrendPredictionContext);
}
