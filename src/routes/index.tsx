import { useAuth } from "@/hooks/useAuth";
import { Home } from "@/pages/Home";
import { Profile } from "@/pages/Profile";
import { Auth } from "@/pages/Auth";
import { EventDetails } from "@/pages/EventDetails";
import { Rewards } from "@/pages/Rewards";
import { MyVouchers } from "@/pages/MyVouchers";
import { Tickets } from "@/pages/Tickets";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminEvents } from "@/pages/admin/AdminEvents";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminFinancial } from "@/pages/admin/AdminFinancial";
import { AdminVouchers } from "@/pages/admin/AdminVouchers";
import { AdminAnalytics } from "@/pages/admin/AdminAnalytics";
import { AdminParticipants } from "@/pages/admin/AdminParticipants";
import { AdminBatches } from "@/pages/admin/AdminBatches";

export const routes = [
  {
    path: '/',
    component: Home,
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
    path: '/ingressos',
    component: Tickets,
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
    component: AdminDashboard,
    private: true,
    adminOnly: true
  },
  {
    path: '/admin/eventos',
    component: AdminEvents,
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
    component: AdminFinancial,
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
  const { isAdmin } = useAuth();
  return route.adminOnly && !isAdmin ? '/' : null;
};

// Exportando constante ROUTES para corrigir erros de importação
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PROFILE: '/profile',
  REWARDS: '/recompensas',
  TICKETS: '/ingressos',
  VOUCHERS: '/meus-vouchers',
  ADMIN: {
    DASHBOARD: '/admin',
    EVENTS: '/admin/eventos',
    USERS: '/admin/usuarios',
    FINANCIAL: '/admin/financeiro',
    VOUCHERS: '/admin/vouchers',
    ANALYTICS: '/admin/analytics',
    PARTICIPANTS: '/admin/participantes',
    BATCHES: '/admin/lotes'
  }
};
