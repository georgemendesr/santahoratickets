
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import EventDetails from "@/pages/EventDetails";
import CreateEvent from "@/pages/CreateEvent";
import EditEvent from "@/pages/EditEvent";
import DuplicateEvent from "@/pages/DuplicateEvent";
import Checkout from "@/pages/Checkout";
import CheckoutFinish from "@/pages/CheckoutFinish";
import PaymentStatus from "@/pages/PaymentStatus";
import ValidateTicket from "@/pages/ValidateTicket";
import Vouchers from "@/pages/Vouchers";
import Rewards from "@/pages/Rewards";
import Admin from "@/pages/Admin";
import AdminUsers from "@/pages/AdminUsers";
import AdminVouchers from "@/pages/AdminVouchers";
import AdminFinanceiro from "@/pages/AdminFinanceiro";
import AdminBatches from "@/pages/AdminBatches";
import AdminParticipants from "@/pages/AdminParticipants";
import AdminParticipantsList from "@/pages/AdminParticipantsList";
import AdminParticipantsSales from "@/pages/AdminParticipantsSales";
import AdminEventos from "@/pages/AdminEventos";
import AdminAnalytics from "@/pages/AdminAnalytics";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import VoucherDesignerRoute from "@/components/voucher/VoucherDesignerRoute";

// Define routes directly here instead of importing from routes/index.tsx
// to avoid circular dependencies
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/eventos/:eventId",
    element: <EventDetails />,
  },
  {
    path: "/eventos/criar",
    element: <CreateEvent />,
  },
  {
    path: "/eventos/:eventId/editar",
    element: <EditEvent />,
  },
  {
    path: "/eventos/:eventId/duplicar",
    element: <DuplicateEvent />,
  },
  {
    path: "/checkout/:eventId",
    element: <Checkout />,
  },
  {
    path: "/checkout/:eventId/finalizar",
    element: <CheckoutFinish />,
  },
  {
    path: "/pagamento/status/:orderId",
    element: <PaymentStatus />,
  },
  {
    path: "/validar-ingresso",
    element: <ValidateTicket />,
  },
  {
    path: "/vouchers",
    element: <Vouchers />,
  },
  {
    path: "/recompensas",
    element: <Rewards />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/eventos",
    element: <AdminEventos />,
  },
  {
    path: "/admin/usuarios",
    element: <AdminUsers />,
  },
  {
    path: "/admin/vouchers",
    element: <AdminVouchers />,
  },
  {
    path: "/admin/vouchers/design",
    element: <VoucherDesignerRoute />,
  },
  {
    path: "/admin/financeiro",
    element: <AdminFinanceiro />,
  },
  {
    path: "/admin/analytics",
    element: <AdminAnalytics />,
  },
  {
    path: "/admin/lotes",
    element: <AdminBatches />,
  },
  {
    path: "/admin/participantes",
    element: <AdminParticipants />,
  },
  {
    path: "/admin/participantes/lista",
    element: <AdminParticipantsList />,
  },
  {
    path: "/admin/participantes/vendas",
    element: <AdminParticipantsSales />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <FeedbackProvider>
      <RouterProvider router={router} />
    </FeedbackProvider>
  );
}

export default App;
