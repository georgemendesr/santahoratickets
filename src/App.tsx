
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import { routes } from "./routes";

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

// Definir as props para os componentes de rota
type RouteComponentProps = {
  isProtected?: boolean;
  isAdminOnly?: boolean;
};

// Construct the router with the routes from routes/index.tsx
const router = createBrowserRouter(
  routes.map(route => ({
    path: route.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        {React.createElement(route.component, {
          isProtected: route.private,
          isAdminOnly: route.adminOnly
        } as RouteComponentProps)}
      </Suspense>
    ),
  }))
);

function App() {
  return (
    <FeedbackProvider>
      <RouterProvider router={router} />
    </FeedbackProvider>
  );
}

export default App;
