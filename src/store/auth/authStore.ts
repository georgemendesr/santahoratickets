
import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useSessionStore } from "./sessionStore";
import { useProfileStore } from "./profileStore";
import { useRoleStore } from "./roleStore";

interface AuthState {
  isLoading: boolean;
  initialized: boolean;
  error: Error | null;
  
  initialize: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Composing the auth store from specialized stores
export const useAuthStore = create<AuthState>((set, get) => ({
  isLoading: false,
  initialized: false,
  error: null,
  
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      
      console.log("AuthStore - Iniciando processo de inicialização");
      
      // First, set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log("AuthStore - Auth state changed:", event);
          
          if (event === 'SIGNED_OUT') {
            console.log("AuthStore - User signed out, limpando dados");
            useSessionStore.getState().setSession(null);
            useProfileStore.getState().clearUserProfile();
            useRoleStore.getState().clearUserRole();
          } else if (newSession) {
            console.log("AuthStore - Nova sessão detectada");
            useSessionStore.getState().setSession(newSession);
          }
        }
      );
      
      // Get the current session
      console.log("AuthStore - Buscando sessão atual");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("AuthStore - Nenhuma sessão encontrada");
        set({ isLoading: false, initialized: true });
        return;
      }
      
      console.log("AuthStore - Sessão encontrada, configurando usuário");
      useSessionStore.getState().setSession(session);
      
      // Fetch the user profile and role in parallel
      await Promise.all([
        _fetchUserData(session),
      ]);
      
      console.log("AuthStore - Inicialização completa");
      set({ initialized: true, isLoading: false });
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ error: error as Error, isLoading: false, initialized: true });
    }
  },
  
  refreshAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      await useSessionStore.getState().refreshSession();
      
      const session = useSessionStore.getState().session;
      if (session) {
        await _fetchUserData(session);
      }
      
      set({ isLoading: false });
    } catch (error) {
      console.error("Error refreshing auth:", error);
      set({ error: error as Error, isLoading: false });
    }
  },
  
  signOut: async () => {
    await useSessionStore.getState().signOut();
    useProfileStore.getState().clearUserProfile();
    useRoleStore.getState().clearUserRole();
    set({ initialized: true });
  }
}));

// Helper function to fetch user data (profile and role)
async function _fetchUserData(session: Session) {
  try {
    console.log("AuthStore - Buscando dados do usuário em paralelo");
    
    // Use Promise.all to fetch profile and role in parallel
    await Promise.all([
      useProfileStore.getState().fetchUserProfile(session.user.id),
      useRoleStore.getState().fetchUserRole(session.user.id),
    ]);
  } catch (err) {
    console.error("AuthStore - Exceção ao buscar dados do usuário:", err);
  }
}
