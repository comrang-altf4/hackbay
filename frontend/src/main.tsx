import ReactDOM from "react-dom/client";
import SelectionProvider from "./contexts/SelectionContext.tsx";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SelectionProvider>
    <App />
  </SelectionProvider>
);
