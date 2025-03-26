
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
    set({ userRole: role, isAdmin });
  },
  
  initialize: async () => {
    // Prevenir múltiplas inicializações simultâneas
    if (get().initialized) {
      set({ isLoading: false });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      // Configurar listener de autenticação primeiro
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            get().setSession(newSession);
            
            // Buscar perfil e papel ao fazer login
            if (newSession?.user?.id) {
              supabase
                .from('user_profiles')
                .select('*')
                .eq('id', newSession.user.id)
                .single()
                .then(({ data }) => {
                  if (data) get().setUserProfile(data as UserProfile);
                });
                
              supabase
                .from('user_roles')
                .select('*')
                .eq('user_id', newSession.user.id)
                .single()
                .then(({ data }) => {
                  if (data) {
                    const userRole: UserRole = {
                      id: data.id,
                      user_id: data.user_id,
                      role: data.role as UserRoleType,
                      created_at: data.created_at
                    };
                    get().setUserRole(userRole);
                  } else {
                    // Default role is 'user' if no role is set
                    get().setUserRole({
                      id: '',
                      user_id: newSession.user.id,
                      role: 'user'
                    });
                  }
                });
            }
          } else if (event === 'SIGNED_OUT') {
            get().setSession(null);
            get().setUserProfile(null);
            get().setUserRole(null);
          }
        }
      );
      
      // Verificar sessão existente
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ isLoading: false, initialized: true });
        return;
      }
      
      get().setSession(session);
      
      // Carregar apenas o necessário assincronamente
      const profilePromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      const rolePromise = supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      // Processar resultados em paralelo
      const [profileResult, roleResult] = await Promise.all([profilePromise, rolePromise]);
      
      if (profileResult.data) {
        get().setUserProfile(profileResult.data as UserProfile);
      }
      
      if (roleResult.data) {
        // Ensure we're using the UserRole type
        const userRole: UserRole = {
          id: roleResult.data.id,
          user_id: roleResult.data.user_id,
          role: roleResult.data.role as UserRoleType,
          created_at: roleResult.data.created_at
        };
        get().setUserRole(userRole);
      } else {
        // Default role is 'user' if no role is set
        get().setUserRole({
          id: '',
          user_id: session.user.id,
          role: 'user'
        });
      }
      
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
    await supabase.auth.signOut();
    set({ 
      session: null, 
      user: null, 
      userProfile: null, 
      userRole: null,
      isAdmin: false
    });
  }
}));
