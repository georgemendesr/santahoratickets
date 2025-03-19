
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate, useParams } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import { routes } from "./routes";

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

// Componente especializado para redirecionar de /events/ para /eventos/
const EventsRedirect = () => {
  const { eventId } = useParams<{ eventId: string }>();
  return <Navigate to={`/eventos/${eventId || ''}`} replace />;
};

// Função para criar as rotas com redirecionamentos apropriados
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

  // Add redirects for legacy URLs
  routerConfig.push({
    path: "/events/:eventId",
    element: <EventsRedirect />,
  });
  
  // Redirect from /events to /eventos
  routerConfig.push({
    path: "/events",
    element: <Navigate to="/eventos" replace />,
  });

  // Add admin redirects if needed
  routerConfig.push({
    path: "/admin/types",
    element: <Navigate to="/admin/batches" replace />,
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
