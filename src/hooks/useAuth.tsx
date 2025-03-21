
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const { 
    session, 
    loading, 
    error, 
    checkAuth, 
    signOut, 
    refreshAuth,
    isAdmin
  } = useAuthStore();
  
  const [authInitialized, setAuthInitialized] = useState(false);

  // Verificamos a autenticação apenas uma vez ao montar o componente
  useEffect(() => {
    console.log("useAuth - Inicializando hook");
    
    if (!authInitialized) {
      console.log("useAuth - Primeira verificação de autenticação");
      checkAuth();
      setAuthInitialized(true);
    }
    
    return () => {
      console.log("useAuth - Limpeza do hook");
    };
  }, [checkAuth, authInitialized]);

  // Função para depurar o problema de autenticação
  const debugAuth = async () => {
    try {
      const sessionResult = await supabase.auth.getSession();
      console.log("Sessão atual:", sessionResult);
      
      const userResult = await supabase.auth.getUser();
      console.log("Usuário atual:", userResult);
      
      return { session: sessionResult, user: userResult };
    } catch (error) {
      console.error("Erro ao depurar autenticação:", error);
      return { error };
    }
  };

  return {
    session,
    loading,
    error,
    signOut,
    debugAuth,
    refreshSession: refreshAuth,
    isAdmin,
    initialized: authInitialized
  };
}
