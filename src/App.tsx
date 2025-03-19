
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./routes";
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

const router = createBrowserRouter([
  {
    path: ROUTES.PUBLIC.HOME,
    element: <Index />,
  },
  {
    path: ROUTES.AUTH.LOGIN,
    element: <Auth />,
  },
  {
    path: ROUTES.PUBLIC.EVENT_DETAILS,
    element: <EventDetails />,
  },
  {
    path: ROUTES.PUBLIC.CREATE_EVENT,
    element: <CreateEvent />,
  },
  {
    path: ROUTES.PUBLIC.EDIT_EVENT,
    element: <EditEvent />,
  },
  {
    path: ROUTES.PUBLIC.DUPLICATE_EVENT,
    element: <DuplicateEvent />,
  },
  {
    path: ROUTES.PUBLIC.CHECKOUT,
    element: <Checkout />,
  },
  {
    path: ROUTES.PUBLIC.CHECKOUT_FINISH,
    element: <CheckoutFinish />,
  },
  {
    path: ROUTES.PUBLIC.PAYMENT_STATUS,
    element: <PaymentStatus />,
  },
  {
    path: ROUTES.PUBLIC.VALIDATE_TICKET,
    element: <ValidateTicket />,
  },
  {
    path: ROUTES.PUBLIC.VOUCHERS,
    element: <Vouchers />,
  },
  {
    path: ROUTES.PUBLIC.REWARDS,
    element: <Rewards />,
  },
  {
    path: ROUTES.ADMIN.DASHBOARD,
    element: <Admin />,
  },
  {
    path: ROUTES.ADMIN.EVENTS,
    element: <AdminEventos />,
  },
  {
    path: ROUTES.ADMIN.USERS,
    element: <AdminUsers />,
  },
  {
    path: ROUTES.ADMIN.VOUCHERS,
    element: <AdminVouchers />,
  },
  {
    path: "/admin/vouchers/design",
    element: <VoucherDesignerRoute />,
  },
  {
    path: ROUTES.ADMIN.FINANCEIRO,
    element: <AdminFinanceiro />,
  },
  {
    path: ROUTES.ADMIN.ANALYTICS,
    element: <AdminAnalytics />,
  },
  {
    path: ROUTES.ADMIN.BATCHES,
    element: <AdminBatches />,
  },
  {
    path: ROUTES.ADMIN.PARTICIPANTS,
    element: <AdminParticipants />,
  },
  {
    path: ROUTES.ADMIN.PARTICIPANTS_LIST,
    element: <AdminParticipantsList />,
  },
  {
    path: ROUTES.ADMIN.PARTICIPANTS_SALES,
    element: <AdminParticipantsSales />,
  },
  {
    path: ROUTES.PUBLIC.PROFILE,
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
