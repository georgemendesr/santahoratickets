
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

interface AuthState {
  session: any | null;
  role: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  lastChecked: number | null;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

// Tempo mínimo entre verificações de autenticação (5 segundos)
const MIN_CHECK_INTERVAL = 5000;

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  role: null,
  isAdmin: false,
  loading: true,
  error: null,
  lastChecked: null,
  
  checkAuth: async () => {
    const now = Date.now();
    const lastChecked = get().lastChecked;
    
    // Evita verificações muito frequentes
    if (lastChecked && now - lastChecked < MIN_CHECK_INTERVAL) {
      console.log("[AuthStore] Verificação ignorada - muito recente");
      return;
    }
    
    try {
      set({ loading: true, error: null, lastChecked: now });
      console.log("[AuthStore] Iniciando verificação de autenticação");
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("[AuthStore] Sem sessão ativa");
        set({ 
          session: null, 
          role: null, 
          isAdmin: false, 
          loading: false 
        });
        return;
      }
      
      // Buscar o papel do usuário
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();
        
      if (error) {
        console.error("[AuthStore] Erro ao buscar role:", error);
        throw error;
      }
      
      const role = data?.role as UserRole || 'user';
      const isAdmin = role === 'admin';
      
      console.log("[AuthStore] Sessão verificada:", { 
        hasSession: !!session,
        role,
        isAdmin
      });
      
      set({ 
        session, 
        role, 
        isAdmin, 
        loading: false 
      });
    } catch (error) {
      console.error("[AuthStore] Erro ao verificar autenticação:", error);
      set({ 
        session: null, 
        role: null, 
        isAdmin: false, 
        error: error.message, 
        loading: false 
      });
    }
  },
  
  refreshAuth: async () => {
    console.log("[AuthStore] Atualizando sessão");
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("[AuthStore] Erro ao atualizar sessão:", error);
      set({ 
        session: null, 
        role: null, 
        isAdmin: false, 
        error: error.message
      });
      return;
    }
    
    set({ session: data.session });
    await get().checkAuth();
  },
  
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ 
        session: null, 
        role: null,
        isAdmin: false,
        error: null,
        lastChecked: null
      });
      console.log("[AuthStore] Logout realizado");
    } catch (error) {
      console.error("[AuthStore] Erro ao fazer logout:", error);
      set({ error: error.message });
    }
  }
}));
