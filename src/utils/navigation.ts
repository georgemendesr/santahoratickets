
import { ROUTES } from "@/routes";

export const navigateTo = (pathname: string) => {
  window.location.href = pathname;
};

// Função para construir URLs de eventos
export const getEventUrl = (eventId: string) => {
  return `/eventos/${eventId}`;
};

export const getEventEditUrl = (eventId: string) => {
  return `/eventos/${eventId}/edit`;
};

// Função para verificar e corrigir URLs de eventos
export const normalizeEventUrl = (url: string) => {
  // Substituir /events/ por /eventos/ nos links
  if (url.includes('/events/')) {
    return url.replace('/events/', '/eventos/');
  }
  return url;
};

// Exportar rotas para uso consistente na aplicação
export { ROUTES };
