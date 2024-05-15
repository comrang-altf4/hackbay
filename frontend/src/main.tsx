import ReactDOM from "react-dom/client";
import SelectionProvider from "./contexts/SelectionContext.tsx";
import ProductTrendProvider from "./contexts/ProductTrendContext.tsx";
import TravelTrendProvider from "./contexts/TravelTrendContext.tsx";
import RegionTrendProvider from "./contexts/RegionTrendContext.tsx";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SelectionProvider>
    <ProductTrendProvider>
      <TravelTrendProvider>
        <RegionTrendProvider>
          <App />
        </RegionTrendProvider>
      </TravelTrendProvider>
    </ProductTrendProvider>
  </SelectionProvider>
);
