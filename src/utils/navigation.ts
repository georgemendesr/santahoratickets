
import { ROUTES } from "@/routes";
import { generatePath } from "react-router-dom";

// Tipos para parâmetros de rota
export type EventIdParam = { eventId: string };  // Garantindo consistência no nome do parâmetro
export type BatchIdParam = { batchId: string };
export type OrderIdParam = { orderId: string };

// Função para navegação direta no window (use somente quando necessário)
export const navigateTo = (pathname: string) => {
  window.location.href = pathname;
};

// Funções tipadas para geração de URLs
export const getEventUrl = (eventId: string): string => {
  return generatePath(ROUTES.EVENTS.DETAILS(eventId));
};

export const getEventEditUrl = (eventId: string): string => {
  return generatePath(ROUTES.EVENTS.EDIT(eventId));
};

export const getCheckoutUrl = (eventId: string): string => {
  return generatePath(`/checkout/${eventId}`);
};

export const getAdminBatchesUrl = (eventId?: string): string => {
  return eventId ? `${ROUTES.ADMIN.BATCHES}?event_id=${eventId}` : ROUTES.ADMIN.BATCHES;
};

// Função para normalizar URLs de eventos
export const normalizeEventUrl = (url: string): string => {
  // Padroniza todas as URLs para usar o formato /eventos/
  if (url.includes('/events/')) {
    return url.replace('/events/', '/eventos/');
  }
  return url;
};

// Função utilitária para extrair parâmetros de URL
export const extractUrlParams = <T extends Record<string, string>>(
  path: string, 
  pattern: string
): T | null => {
  // Extrai nomes de parâmetros do padrão (ex: 'eventId' de ':eventId')
  const paramNames = (pattern.match(/:\w+/g) || [])
    .map(param => param.substring(1));
  
  // Converte padrão para regex com grupos de captura
  const regexPattern = pattern
    .replace(/:\w+/g, '([^/]+)')
    .replace(/\//g, '\\/');
    
  const regex = new RegExp(`^${regexPattern}$`);
  const matches = path.match(regex);
  
  if (!matches) return null;
  
  // Cria objeto de parâmetros
  const params: Record<string, string> = {};
  paramNames.forEach((name, index) => {
    params[name] = matches[index + 1];
  });
  
  return params as T;
};

// Exportar rotas para uso consistente na aplicação
export { ROUTES };
