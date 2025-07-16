import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./contexts/UserProvider.jsx";
import { CartProvider } from "./contexts/CartProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <UserProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserProvider>
    </Router>
  </StrictMode>
);
