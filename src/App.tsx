
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate, useParams } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import { routes } from "./routes";

// Importar ferramentas de diagnóstico
import "@/utils/batchDebugger";

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

// Carregamento preguiçoso para as novas páginas
const EventBatchesView = lazy(() => import("@/pages/EventBatchesView"));

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
    element: <Navigate to="/admin/lotes" replace />,
  });
  
  // Add redirect from /admin/batches to /admin/lotes
  routerConfig.push({
    path: "/admin/batches",
    element: <Navigate to="/admin/lotes" replace />,
  });

  // Add new EventBatchesView route
  routerConfig.push({
    path: "/admin/eventos/:eventId/batches-view",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <EventBatchesView />
      </Suspense>
    ),
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
