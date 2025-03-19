
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import VoucherDesignerRoute from "@/components/voucher/VoucherDesignerRoute";

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
    path: "/events/:eventId",
    element: <EventDetails />,
  },
  {
    path: "/events/create",
    element: <CreateEvent />,
  },
  {
    path: "/events/:eventId/edit",
    element: <EditEvent />,
  },
  {
    path: "/events/:eventId/duplicate",
    element: <DuplicateEvent />,
  },
  {
    path: "/checkout/:eventId",
    element: <Checkout />,
  },
  {
    path: "/checkout/:eventId/finish",
    element: <CheckoutFinish />,
  },
  {
    path: "/payment/:paymentId/status",
    element: <PaymentStatus />,
  },
  {
    path: "/validate-ticket",
    element: <ValidateTicket />,
  },
  {
    path: "/vouchers",
    element: <Vouchers />,
  },
  {
    path: "/rewards",
    element: <Rewards />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/users",
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
    path: "/admin/batches",
    element: <AdminBatches />,
  },
  {
    path: "/admin/participants",
    element: <AdminParticipants />,
  },
  {
    path: "/admin/participants/list",
    element: <AdminParticipantsList />,
  },
  {
    path: "/admin/participants/sales",
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
  return <RouterProvider router={router} />;
}

export default App;
