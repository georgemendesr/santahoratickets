
import { ROUTES } from '../routes';

export const navigate = {
  toBatches: (eventId?: string) => {
    if (!eventId) {
      console.error("Navigate: eventId é obrigatório para toBatches");
      return ROUTES.ADMIN.BATCHES;
    }
    return `${ROUTES.ADMIN.BATCHES}?event_id=${encodeURIComponent(eventId)}`;
  },
  toEventDetails: (eventId: string) => {
    if (!eventId) {
      console.error("Navigate: eventId é obrigatório para toEventDetails");
      return ROUTES.PUBLIC.HOME;
    }
    return ROUTES.PUBLIC.EVENT_DETAILS.replace(':eventId', eventId);
  },
  toEditEvent: (eventId: string) => {
    if (!eventId) {
      console.error("Navigate: eventId é obrigatório para toEditEvent");
      return ROUTES.PUBLIC.HOME;
    }
    return ROUTES.PUBLIC.EDIT_EVENT.replace(':eventId', eventId);
  },
  toDuplicateEvent: (eventId: string) => {
    if (!eventId) {
      console.error("Navigate: eventId é obrigatório para toDuplicateEvent");
      return ROUTES.PUBLIC.HOME;
    }
    return ROUTES.PUBLIC.DUPLICATE_EVENT.replace(':eventId', eventId);
  },
  toCheckout: (eventId: string) => {
    if (!eventId) {
      console.error("Navigate: eventId é obrigatório para toCheckout");
      return ROUTES.PUBLIC.HOME;
    }
    return ROUTES.PUBLIC.CHECKOUT.replace(':eventId', eventId);
  },
  toCheckoutFinish: (eventId: string, params?: Record<string, string | number>) => {
    if (!eventId) {
      console.error("Navigate: eventId é obrigatório para toCheckoutFinish");
      return ROUTES.PUBLIC.HOME;
    }
    
    const base = ROUTES.PUBLIC.CHECKOUT_FINISH.replace(':eventId', eventId);
    
    if (!params) return base;
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });
    
    return `${base}?${queryParams.toString()}`;
  },
  toPaymentStatus: (paymentId: string) => {
    if (!paymentId) {
      console.error("Navigate: paymentId é obrigatório para toPaymentStatus");
      return ROUTES.PUBLIC.HOME;
    }
    return ROUTES.PUBLIC.PAYMENT_STATUS.replace(':paymentId', paymentId);
  }
};
