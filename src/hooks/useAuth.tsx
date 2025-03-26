
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { 
    session, 
    isLoading,
    error, 
    initialize, 
    signOut, 
    refreshAuth,
    isAdmin,
    userProfile,
    setSession
  } = useAuthStore();
  
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authTimeoutOccurred, setAuthTimeoutOccurred] = useState(false);

  // Using React Query for session check with simpler pattern
  const { isLoading: isSessionLoading } = useQuery({
    queryKey: ['authSession'],
    queryFn: async () => {
      if (authInitialized) return session;
      
      console.log("useAuth - Buscando sessão via React Query");
      try {
        const timeoutId = setTimeout(() => {
          console.error("useAuth - TIMEOUT: Verificação de sessão demorou demais para responder");
          setAuthTimeoutOccurred(true);
        }, 5000); // 5-second timeout
        
        const { data } = await supabase.auth.getSession();
        clearTimeout(timeoutId);
        
        if (data.session) {
          setSession(data.session);
          return data.session;
        }
        return null;
      } catch (err) {
        console.error("useAuth - Erro ao verificar sessão:", err);
        return null;
      }
    },
    staleTime: 1000 * 60 * 2, // Cache por 2 minutos
    retry: 1,
    enabled: !authInitialized
  });

  // Initialize authentication when query completes
  useEffect(() => {
    if (!authInitialized && !isSessionLoading) {
      const initAuth = async () => {
        try {
          console.log("useAuth - Inicializando autenticação");
          
          // Set up authentication timeout
          const timeoutId = setTimeout(() => {
            console.error("useAuth - TIMEOUT: Autenticação demorou demais para responder");
            setAuthTimeoutOccurred(true);
            setAuthInitialized(true); // Mark as initialized to prevent further attempts
            toast.error("Tempo limite de autenticação excedido. Tente novamente mais tarde.");
          }, 7000); // 7-second timeout
          
          await initialize();
          
          // Clear timeout if auth completes successfully
          clearTimeout(timeoutId);
          
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
  }, [initialize, authInitialized, isSessionLoading]);

  // Force reset authentication
  const resetAuth = useCallback(async () => {
    console.log("useAuth - Forçando reset da autenticação");
    try {
      // Clear any existing session
      await signOut();
      
      // Clear local storage authentication data
      localStorage.removeItem('supabase.auth.token');
      
      // Reset states
      setAuthInitialized(false);
      setAuthTimeoutOccurred(false);
      
      // Reload the page to start fresh
      window.location.href = '/';
      
      toast.success("Autenticação reiniciada. Por favor, faça login novamente.");
    } catch (err) {
      console.error("Erro ao resetar autenticação:", err);
      toast.error("Erro ao resetar autenticação");
      
      // Last resort - force reload
      window.location.reload();
    }
  }, [signOut]);

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
    loading: isLoading || isSessionLoading,
    error,
    signOut,
    debugAuth,
    refreshSession: refreshAuth,
    isAdmin,
    initialized: authInitialized,
    userProfile,
    resetAuth,
    authTimeoutOccurred
  };
}
