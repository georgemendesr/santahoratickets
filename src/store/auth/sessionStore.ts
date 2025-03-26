
import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SessionState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  initialized: boolean;
  error: Error | null;
  
  setSession: (session: Session | null) => void;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  user: null,
  isLoading: false,
  initialized: false,
  error: null,
  
  setSession: (session: Session | null) => {
    set({ 
      session, 
      user: session?.user || null,
    });
  },
  
  refreshSession: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log("SessionStore - Refreshing session");
      const { data: { session } } = await supabase.auth.getSession();
      get().setSession(session);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error refreshing session:", error);
      set({ error: error as Error, isLoading: false });
    }
  },
  
  signOut: async () => {
    try {
      console.log("SessionStore - Iniciando processo de logout");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("SessionStore - Erro ao fazer logout:", error);
        throw error;
      }
      
      console.log("SessionStore - Logout bem-sucedido");
      set({ 
        session: null, 
        user: null,
        initialized: true
      });
      
      return Promise.resolve();
    } catch (e) {
      console.error("SessionStore - Exceção durante logout:", e);
      // Still reset state on error
      set({ 
        session: null, 
        user: null,
        initialized: true
      });
      
      return Promise.resolve();
    }
  }
}));
