
export const ROUTES = {
  ADMIN: {
    DASHBOARD: '/admin',
    EVENTS: '/admin/eventos',
    VOUCHERS: '/admin/vouchers',
    BATCHES: '/admin/batches',
    ANALYTICS: '/admin/analytics',
    FINANCEIRO: '/admin/financeiro',
    USERS: '/admin/users',
    PARTICIPANTS: '/admin/participants',
    PARTICIPANTS_LIST: '/admin/participants/list',
    PARTICIPANTS_SALES: '/admin/participants/sales',
  },
  AUTH: {
    LOGIN: '/auth',
    REGISTER: '/auth/register',
  },
  PUBLIC: {
    HOME: '/',
    EVENT_DETAILS: '/events/:eventId',
    CREATE_EVENT: '/events/create',
    EDIT_EVENT: '/events/:eventId/edit',
    DUPLICATE_EVENT: '/events/:eventId/duplicate',
    CHECKOUT: '/checkout/:eventId',
    CHECKOUT_FINISH: '/checkout/:eventId/finish',
    PAYMENT_STATUS: '/payment/:paymentId/status',
    VALIDATE_TICKET: '/validate-ticket',
    VOUCHERS: '/vouchers',
    REWARDS: '/rewards',
    PROFILE: '/profile',
  },
};
