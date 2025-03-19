
import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import EventDetails from "@/pages/EventDetails";
import NotFound from "@/pages/NotFound";
import Checkout from "@/pages/Checkout";
import PaymentStatus from "@/pages/PaymentStatus";
import CheckoutFinish from "@/pages/CheckoutFinish";
import CreateEvent from "@/pages/CreateEvent";
import EditEvent from "@/pages/EditEvent";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import AdminUsers from "@/pages/AdminUsers";
import AdminEventos from "@/pages/AdminEventos";
import AdminFinancial from "@/pages/AdminFinancial";
import AdminFinanceiro from "@/pages/AdminFinanceiro";
import AdminParticipants from "@/pages/AdminParticipants";
import AdminParticipantsList from "@/pages/AdminParticipantsList";
import AdminParticipantsSales from "@/pages/AdminParticipantsSales";
import AdminVouchers from "@/pages/AdminVouchers";
import AdminBatches from "@/pages/AdminBatches";
import ValidateTicket from "@/pages/ValidateTicket";
import Vouchers from "@/pages/Vouchers";
import DuplicateEvent from "@/pages/DuplicateEvent";
import AdminAnalytics from "@/pages/AdminAnalytics";
import Rewards from "@/pages/Rewards";
import MyVouchers from "@/pages/MyVouchers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/events/:eventId",
    element: <EventDetails />
  },
  {
    path: "/checkout/:eventId",
    element: <Checkout />
  },
  {
    path: "/checkout/finish/:eventId",
    element: <CheckoutFinish />
  },
  {
    path: "/payment/:paymentId/status",
    element: <PaymentStatus />
  },
  {
    path: "/events/create",
    element: <CreateEvent />
  },
  {
    path: "/events/:eventId/edit",
    element: <EditEvent />
  },
  {
    path: "/events/:eventId/duplicate",
    element: <DuplicateEvent />
  },
  {
    path: "/perfil",
    element: <Profile />
  },
  {
    path: "/admin",
    element: <Admin />
  },
  {
    path: "/admin/usuarios",
    element: <AdminUsers />
  },
  {
    path: "/admin/eventos",
    element: <AdminEventos />
  },
  {
    path: "/admin/financeiro",
    element: <AdminFinanceiro />
  },
  {
    path: "/admin/financial",
    element: <AdminFinancial />
  },
  {
    path: "/admin/participantes",
    element: <AdminParticipants />
  },
  {
    path: "/admin/participantes/lista",
    element: <AdminParticipantsList />
  },
  {
    path: "/admin/participantes/vendas",
    element: <AdminParticipantsSales />
  },
  {
    path: "/admin/vouchers",
    element: <AdminVouchers />
  },
  {
    path: "/admin/lotes",
    element: <AdminBatches />
  },
  {
    path: "/admin/analytics",
    element: <AdminAnalytics />
  },
  {
    path: "/validar-ingresso",
    element: <ValidateTicket />
  },
  {
    path: "/meus-vouchers",
    element: <MyVouchers />
  },
  {
    path: "/vouchers",
    element: <Vouchers />
  },
  {
    path: "/recompensas",
    element: <Rewards />
  }
]);
