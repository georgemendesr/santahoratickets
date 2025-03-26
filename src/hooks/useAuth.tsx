
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuth() {
  const { 
    session, 
    isLoading,
    error, 
    initialize, 
    signOut, 
    refreshAuth,
    isAdmin,
    userProfile
  } = useAuthStore();
  
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize authentication on first render
  useEffect(() => {
    if (!authInitialized) {
      const initAuth = async () => {
        try {
          console.log("useAuth - Inicializando autenticação");
          await initialize();
          console.log("useAuth - Autenticação inicializada com sucesso");
          setAuthInitialized(true);
        } catch (err) {
          console.error("Falha ao inicializar autenticação:", err);
          toast.error("Falha ao inicializar autenticação");
          setAuthInitialized(true); // Still mark as initialized to prevent infinite retries
        }
      };
      
      initAuth();
    }
  }, [initialize, authInitialized]);

  // Debug function to help troubleshoot auth issues
  const debugAuth = async () => {
    try {
      const sessionResult = await supabase.auth.getSession();
      console.log("Auth Debug - Sessão atual:", sessionResult);
      
      const userResult = await supabase.auth.getUser();
      console.log("Auth Debug - Usuário atual:", userResult);
      
      return { session: sessionResult, user: userResult };
    } catch (error) {
      console.error("Erro ao debugar autenticação:", error);
      return { error };
    }
  };

  return {
    session,
    user: session?.user || null,
    loading: isLoading,
    error,
    signOut,
    debugAuth,
    refreshSession: refreshAuth,
    isAdmin,
    initialized: authInitialized,
    userProfile
  };
}
