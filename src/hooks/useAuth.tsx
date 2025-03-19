
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obter a sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Sessão obtida:", !!session);
      setSession(session);
      setLoading(false);
    });

    // Configurar listener para mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { event: _event, hasSession: !!session });
      setSession(session);
      setLoading(false);
    });

    // Cleanup: remover listener quando o componente for desmontado
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error);
        throw error;
      }
      console.log("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro completo ao fazer logout:", error);
    }
  };

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
    signOut,
    debugAuth
  };
}
