
import { useAuth } from "@/hooks/useAuth";
// Import default exports correctly
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import EventDetails from "@/pages/EventDetails";
import Rewards from "@/pages/Rewards";
import MyVouchers from "@/pages/MyVouchers";
// Admin imports
import Admin from "@/pages/Admin";
import AdminEventos from "@/pages/AdminEventos";
import AdminUsers from "@/pages/AdminUsers";
import AdminFinanceiro from "@/pages/AdminFinanceiro";
import AdminVouchers from "@/pages/AdminVouchers";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminParticipants from "@/pages/AdminParticipants";
import AdminBatches from "@/pages/AdminBatches";
import AdminParticipantsList from "@/pages/AdminParticipantsList";
import AdminParticipantsSales from "@/pages/AdminParticipantsSales";

export const routes = [
  {
    path: '/',
    component: Index,
    private: false,
  },
  {
    path: '/auth',
    component: Auth,
    private: false,
    publicOnly: true
  },
  {
    path: '/profile',
    component: Profile,
    private: true,
  },
  {
    path: '/recompensas',
    component: Rewards,
    private: true,
  },
  {
    path: '/meus-vouchers',
    component: MyVouchers,
    private: true,
  },
  {
    path: '/eventos/:eventId',
    component: EventDetails,
    private: false,
  },
  {
    path: '/admin',
    component: Admin,
    private: true,
    adminOnly: true
  },
  {
    path: '/admin/eventos',
    component: AdminEventos,
    private: true,
    adminOnly: true
  },
  {
    path: '/admin/usuarios',
    component: AdminUsers,
    private: true,
    adminOnly: true
  },
  {
    path: '/admin/financeiro',
    component: AdminFinanceiro,
    private: true,
    adminOnly: true
  },
  {
    path: '/admin/vouchers',
    component: AdminVouchers,
    private: true,
    adminOnly: true
  },
  {
    path: '/admin/analytics',
    component: AdminAnalytics,
    private: true,
    adminOnly: true
  },
  {
    path: '/admin/participantes',
    component: AdminParticipants,
    private: true,
    adminOnly: true
  },
  {
    path: '/admin/participantes/lista',
    component: AdminParticipantsList,
    private: true,
    adminOnly: true
  },
  {
    path: '/admin/participantes/vendas',
    component: AdminParticipantsSales,
    private: true,
    adminOnly: true
  },
  {
    path: '/admin/lotes',
    component: AdminBatches,
    private: true,
    adminOnly: true
  }
];

export const protectedRoute = (route: any) => {
  const { session } = useAuth();
  return route.private && !session ? '/auth' : null;
};

export const adminOnlyRoute = (route: any) => {
  const { session, isAdmin } = useAuth();
  // Check if user has admin role
  return route.adminOnly && !isAdmin ? '/' : null;
};

// Export constant ROUTES for consistent navigation
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PROFILE: '/profile',
  REWARDS: '/recompensas',
  VOUCHERS: '/meus-vouchers',
  ADMIN: {
    DASHBOARD: '/admin',
    EVENTS: '/admin/eventos',
    USERS: '/admin/usuarios',
    FINANCIAL: '/admin/financeiro',
    VOUCHERS: '/admin/vouchers',
    ANALYTICS: '/admin/analytics',
    PARTICIPANTS: '/admin/participantes',
    PARTICIPANTS_LIST: '/admin/participantes/lista',
    PARTICIPANTS_SALES: '/admin/participantes/vendas',
    BATCHES: '/admin/lotes'
  }
};
