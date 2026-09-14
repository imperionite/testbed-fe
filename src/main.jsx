import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeContextProvider } from "./providers/ThemeContext";
import QueryProvider from "./providers/QueryProvider";
import { Toaster } from "react-hot-toast";

import "@fontsource/atkinson-hyperlegible";

import "./index.css";
import App from "./App.jsx";

async function prepare() {
  if (import.meta.env.VITE_MOCK !== "true") return;

  try {
    const mockModulePath = "./mock/index.js";
    const { startMockServer } = await import(
      /* @vite-ignore */ mockModulePath
    );

    if (typeof startMockServer === "function") {
      await startMockServer();
    } else {
      console.warn("Mock module does not export startMockServer.");
    }
  } catch (error) {
    console.warn("Mock server unavailable; continuing without mocks.", error);
  }
}

prepare().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeContextProvider>
          <QueryProvider>
            <App />
          </QueryProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
            }}
          />
        </ThemeContextProvider>
      </BrowserRouter>
    </StrictMode>,
  );
});
