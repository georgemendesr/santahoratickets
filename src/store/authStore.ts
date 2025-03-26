
import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile, UserRole, UserRoleType } from "@/types/user.types";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  initialized: boolean;
  error: Error | null;
  
  setSession: (session: Session | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setUserRole: (role: UserRole | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  userProfile: null,
  userRole: null,
  isAdmin: false,
  isLoading: true,
  initialized: false,
  error: null,
  
  setSession: (session: Session | null) => {
    set({ 
      session, 
      user: session?.user || null,
    });
  },
  
  setUserProfile: (profile: UserProfile | null) => {
    set({ userProfile: profile });
  },
  
  setUserRole: (role: UserRole | null) => {
    const isAdmin = role?.role === 'admin';
    console.log("AuthStore - Atualizando role para:", role?.role, "isAdmin:", isAdmin);
    set({ userRole: role, isAdmin });
  },
  
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
            get().setSession(null);
            get().setUserProfile(null);
            get().setUserRole(null);
          } else if (newSession) {
            console.log("AuthStore - Nova sessão detectada");
            get().setSession(newSession);
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
      get().setSession(session);
      
      // Fetch the user profile (usando Promise.all para paralelizar requisições)
      console.log("AuthStore - Buscando dados do usuário em paralelo");
      
      try {
        const [profileResult, roleResult] = await Promise.all([
          // Busca perfil
          supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle(),
            
          // Busca papel
          supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle()
        ]);
        
        // Processa resultado do perfil
        if (profileResult.error) {
          console.error("AuthStore - Erro ao buscar perfil:", profileResult.error);
        } else if (profileResult.data) {
          console.log("AuthStore - Perfil encontrado");
          get().setUserProfile(profileResult.data as UserProfile);
        } else {
          console.log("AuthStore - Perfil não encontrado");
        }
        
        // Processa resultado do papel
        if (roleResult.error) {
          console.error("AuthStore - Erro ao buscar papel:", roleResult.error);
        } else if (roleResult.data) {
          console.log("AuthStore - Papel encontrado:", roleResult.data.role);
          // Ensure we're using the UserRole type
          const userRole: UserRole = {
            id: roleResult.data.id,
            user_id: roleResult.data.user_id,
            role: roleResult.data.role as UserRoleType,
            created_at: roleResult.data.created_at
          };
          get().setUserRole(userRole);
        } else {
          console.log("AuthStore - Nenhum papel encontrado, definindo como usuário padrão");
          // Default role is 'user' if no role is set
          get().setUserRole({
            id: '',
            user_id: session.user.id,
            role: 'user'
          });
        }
      } catch (err) {
        console.error("AuthStore - Exceção ao buscar dados do usuário:", err);
        // Set default role on error
        get().setUserRole({
          id: '',
          user_id: session.user.id,
          role: 'user'
        });
      }
      
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
      const { data: { session } } = await supabase.auth.getSession();
      get().setSession(session);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error refreshing auth:", error);
      set({ error: error as Error, isLoading: false });
    }
  },
  
  signOut: async () => {
    try {
      console.log("AuthStore - Iniciando processo de logout");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("AuthStore - Erro ao fazer logout:", error);
        throw error;
      }
      
      console.log("AuthStore - Logout bem-sucedido, limpando dados");
      set({ 
        session: null, 
        user: null, 
        userProfile: null, 
        userRole: null,
        isAdmin: false,
        initialized: true
      });
    } catch (e) {
      console.error("AuthStore - Exceção durante logout:", e);
      // Still reset state on error
      set({ 
        session: null, 
        user: null, 
        userProfile: null, 
        userRole: null,
        isAdmin: false,
        initialized: true
      });
    }
  }
}));
