import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelectionContext } from "./SelectionContext";

type ProductTrend = {
  id: string;
  name: string;
  count: number;
  duration: number;
};

type ProductTrendContextType = {
  productTrend: ProductTrend[];
};

const ProductTrendContext = createContext<ProductTrendContextType>({
  productTrend: [],
});

export default function ProductTrendProvider(props: { children: ReactNode }) {
  const { regions, season, period, ageGroup } = useSelectionContext();
  const [productTrend, setProductTrend] = useState<ProductTrend[]>([]);
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "";
    if (serverUrl && regions.length > 0) {
      fetch(serverUrl + "/trend/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regions, season, period, age_group: ageGroup }),
      }).then(async (response) => {
        if (response.status < 400) {
          const responseBody = await response.json();
          setProductTrend(
            (responseBody as any[]).map(
              ({
                JourneyProductCode,
                SalesCount,
                JourneyProductName,
                Duration,
              }) => ({
                id: JourneyProductCode,
                count: SalesCount,
                name: JourneyProductName,
                duration: Duration,
              })
            )
          );
        }
      });
    }
  }, [regions, season, period, ageGroup]);
  return (
    <ProductTrendContext.Provider value={{ productTrend }}>
      {props.children}
    </ProductTrendContext.Provider>
  );
}

export function useProductTrendContext() {
  return useContext(ProductTrendContext);
}
