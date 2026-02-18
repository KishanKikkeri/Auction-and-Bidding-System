import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <App />
        {/*<ReactQueryDevtools initialIsOpen={false} /> */}
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
