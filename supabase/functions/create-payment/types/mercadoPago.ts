
/**
 * Tipos para o MercadoPago - para expandir conforme necessário
 */

// Tipo para resposta de preferência de pagamento
export interface PreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

// Tipo para resposta de teste
export interface TestResponse {
  status: string;
  preference_id?: string;
  init_point?: string;
  sandbox_init_point?: string;
  message?: string;
}

// Tipo para resposta de checkout
export interface CheckoutResponse {
  data: {
    checkout_url: string;
    preference_id: string;
  };
  status: string;
}

// Tipo para resposta PIX
export interface PixResponse {
  status: string;
  data: {
    qr_code?: string;
    qr_code_base64?: string;
    [key: string]: any;
  };
  payment_id: string;
}
