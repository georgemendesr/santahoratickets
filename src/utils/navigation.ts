
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

// Exportar rotas para uso consistente na aplicação
export { ROUTES };
