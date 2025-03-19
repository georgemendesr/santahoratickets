
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

interface AuthState {
  session: any | null;
  role: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  role: null,
  isAdmin: false,
  loading: true,
  error: null,
  
  checkAuth: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
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
        
      if (error) throw error;
      
      const role = data?.role as UserRole || 'user';
      const isAdmin = role === 'admin';
      
      set({ 
        session, 
        role, 
        isAdmin, 
        loading: false 
      });
      
      console.log("[AuthStore] Sessão verificada:", { session: !!session, isAdmin });
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
        error: null 
      });
      console.log("[AuthStore] Logout realizado");
    } catch (error) {
      console.error("[AuthStore] Erro ao fazer logout:", error);
      set({ error: error.message });
    }
  }
}));
