import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Comparar from "./comparar.jsx";
import PokemonDetail from "./PokemonDetail.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    {
      path: "/home",
      element: <App />,
    },
    {
      path: "/comparar",
      element: <Comparar />,
    },
    {
      path: "/detalhes/:id",
      element: <PokemonDetail />,
    }
  ],
  {
    basename: "/",
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
