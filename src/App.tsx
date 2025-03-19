
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useParams } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import { routes } from "./routes";

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

// Create a wrapper component for event redirects
const EventsRedirect = () => {
  const { eventId } = useParams();
  return <Navigate to={`/eventos/${eventId}`} replace />;
};

// Adicione um redirecionamento de '/events/' para '/eventos/'
const createRoutes = () => {
  // Base routes
  const routerConfig = routes.map(route => ({
    path: route.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        {React.createElement(route.component)}
      </Suspense>
    ),
  }));

  // Add redirects for common wrong URLs
  routerConfig.push({
    path: "/events/:eventId",
    element: <EventsRedirect />,
  });

  return routerConfig;
};

// Construct the router with the routes from routes/index.tsx
const router = createBrowserRouter(createRoutes());

function App() {
  return (
    <FeedbackProvider>
      <RouterProvider router={router} />
    </FeedbackProvider>
  );
}

export default App;
