
import { useCallback } from 'react';
import { useNavigate, generatePath } from 'react-router-dom';
import { ROUTES } from "@/routes";

/**
 * Hook personalizado para navegação tipada na aplicação
 * Centraliza todas as funções de navegação para garantir consistência
 */
export function useNavigation() {
  const navigate = useNavigate();
  
  // Navegação para página inicial
  const goToHome = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);
  
  // Navegação para autenticação
  const goToAuth = useCallback(() => {
    navigate(ROUTES.AUTH);
  }, [navigate]);
  
  // Navegação para perfil
  const goToProfile = useCallback(() => {
    navigate(ROUTES.PROFILE);
  }, [navigate]);
  
  // Navegação para eventos
  const goToEventDetails = useCallback((eventId: string) => {
    navigate(ROUTES.EVENTS.DETAILS(eventId));
  }, [navigate]);
  
  const goToEventEdit = useCallback((eventId: string) => {
    navigate(ROUTES.EVENTS.EDIT(eventId));
  }, [navigate]);
  
  // Navegação para checkout
  const goToCheckout = useCallback((eventId: string) => {
    navigate(`/checkout/${eventId}`);
  }, [navigate]);
  
  // Navegação para programa de fidelidade e vouchers
  const goToRewards = useCallback(() => {
    navigate(ROUTES.REWARDS);
  }, [navigate]);
  
  const goToMyVouchers = useCallback(() => {
    navigate(ROUTES.VOUCHERS);
  }, [navigate]);
  
  // Navegação para admin
  const goToAdmin = useCallback(() => {
    navigate(ROUTES.ADMIN.DASHBOARD);
  }, [navigate]);
  
  const goToAdminEvents = useCallback(() => {
    navigate(ROUTES.ADMIN.EVENTS);
  }, [navigate]);
  
  const goToAdminUsers = useCallback(() => {
    navigate(ROUTES.ADMIN.USERS);
  }, [navigate]);
  
  const goToAdminFinancial = useCallback(() => {
    navigate(ROUTES.ADMIN.FINANCIAL);
  }, [navigate]);
  
  const goToAdminVouchers = useCallback(() => {
    navigate(ROUTES.ADMIN.VOUCHERS);
  }, [navigate]);
  
  const goToAdminAnalytics = useCallback(() => {
    navigate(ROUTES.ADMIN.ANALYTICS);
  }, [navigate]);
  
  const goToAdminParticipants = useCallback(() => {
    navigate(ROUTES.ADMIN.PARTICIPANTS);
  }, [navigate]);
  
  const goToAdminParticipantsList = useCallback(() => {
    navigate(ROUTES.ADMIN.PARTICIPANTS_LIST);
  }, [navigate]);
  
  const goToAdminParticipantsSales = useCallback(() => {
    navigate(ROUTES.ADMIN.PARTICIPANTS_SALES);
  }, [navigate]);
  
  const goToAdminBatches = useCallback((eventId?: string) => {
    if (eventId) {
      navigate(`${ROUTES.ADMIN.BATCHES}?event_id=${eventId}`);
    } else {
      navigate(ROUTES.ADMIN.BATCHES);
    }
  }, [navigate]);
  
  // Utilitários de navegação
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  
  // Navegação para página com parâmetros
  const navigateTo = useCallback((path: string, params?: Record<string, string>) => {
    if (params) {
      navigate(generatePath(path, params));
    } else {
      navigate(path);
    }
  }, [navigate]);
  
  return {
    goToHome,
    goToAuth,
    goToProfile,
    goToEventDetails,
    goToEventEdit,
    goToCheckout,
    goToRewards,
    goToMyVouchers,
    goToAdmin,
    goToAdminEvents,
    goToAdminUsers,
    goToAdminFinancial,
    goToAdminVouchers,
    goToAdminAnalytics,
    goToAdminParticipants,
    goToAdminParticipantsList,
    goToAdminParticipantsSales,
    goToAdminBatches,
    goBack,
    navigateTo,
  };
}
