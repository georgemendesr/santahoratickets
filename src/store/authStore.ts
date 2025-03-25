
import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile, UserRole } from "@/types/user.types";
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
    try {
      set({ isLoading: true, error: null });
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ isLoading: false, initialized: true });
        return;
      }
      
      get().setSession(session);
      
      // Fetch the user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        get().setUserProfile(profile as UserProfile);
      }
      
      // Fetch the user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (roleData) {
        // Ensure we're using the UserRole type
        const userRole: UserRole = {
          id: roleData.id,
          user_id: roleData.user_id,
          role: roleData.role as 'admin' | 'user' | 'staff',
          created_at: roleData.created_at
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
      
      // Set up authentication state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          get().setSession(newSession);
          
          if (event === 'SIGNED_OUT') {
            get().setUserProfile(null);
            get().setUserRole(null);
          }
        }
      );
      
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
