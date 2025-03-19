
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "@/routes";

/**
 * Hook personalizado para navegação tipada na aplicação
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
  
  // Navegação para admin
  const goToAdmin = useCallback(() => {
    navigate(ROUTES.ADMIN.DASHBOARD);
  }, [navigate]);
  
  const goToAdminEvents = useCallback(() => {
    navigate(ROUTES.ADMIN.EVENTS);
  }, [navigate]);
  
  // Utilitários de navegação
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  
  return {
    goToHome,
    goToAuth,
    goToProfile,
    goToEventDetails,
    goToEventEdit,
    goToCheckout,
    goToAdmin,
    goToAdminEvents,
    goBack,
    // Função genérica (usar com cautela)
    navigateTo: navigate
  };
}
