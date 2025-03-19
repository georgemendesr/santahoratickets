
import { lazy } from "react";

// Use lazy loading para evitar circular dependencies
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Profile = lazy(() => import("@/pages/Profile"));
const EventDetails = lazy(() => import("@/pages/EventDetails"));
const EditEvent = lazy(() => import("@/pages/EditEvent"));
const Rewards = lazy(() => import("@/pages/Rewards"));
const MyVouchers = lazy(() => import("@/pages/MyVouchers"));
// Admin imports
const Admin = lazy(() => import("@/pages/Admin"));
const AdminEventos = lazy(() => import("@/pages/AdminEventos"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const AdminFinanceiro = lazy(() => import("@/pages/AdminFinanceiro"));
const AdminVouchers = lazy(() => import("@/pages/AdminVouchers"));
const AdminAnalytics = lazy(() => import("@/pages/AdminAnalytics"));
const AdminParticipants = lazy(() => import("@/pages/AdminParticipants"));
const AdminBatches = lazy(() => import("@/pages/AdminBatches"));
const AdminParticipantsList = lazy(() => import("@/pages/AdminParticipantsList"));
const AdminParticipantsSales = lazy(() => import("@/pages/AdminParticipantsSales"));
const NotFound = lazy(() => import("@/pages/NotFound"));

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
    path: '/eventos/:id/edit',
    component: EditEvent,
    private: true,
    adminOnly: true
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
  },
  {
    path: '*',
    component: NotFound,
    private: false,
  }
];

// Componentes de proteção de rota serão tratados nos componentes individuais usando useAuth

// Export constant ROUTES for consistent navigation
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  PROFILE: '/profile',
  REWARDS: '/recompensas',
  VOUCHERS: '/meus-vouchers',
  EVENTS: {
    DETAILS: (id: string) => `/eventos/${id}`,
    EDIT: (id: string) => `/eventos/${id}/edit`,
  },
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
