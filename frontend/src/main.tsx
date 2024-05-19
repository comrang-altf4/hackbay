import ReactDOM from "react-dom/client";
import SelectionProvider from "./contexts/SelectionContext.tsx";
import ProductTrendProvider from "./contexts/ProductTrendContext.tsx";
import TravelTrendProvider from "./contexts/TravelTrendContext.tsx";
import RegionTrendProvider from "./contexts/RegionTrendContext.tsx";
import App from "./App.tsx";
import "./index.css";
import TrendPredictionProvider from "./contexts/TrendPredictionContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SelectionProvider>
    <ProductTrendProvider>
      <TravelTrendProvider>
        <RegionTrendProvider>
          <TrendPredictionProvider>
            <App />
          </TrendPredictionProvider>
        </RegionTrendProvider>
      </TravelTrendProvider>
    </ProductTrendProvider>
  </SelectionProvider>
);
