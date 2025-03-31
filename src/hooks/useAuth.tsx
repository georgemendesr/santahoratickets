
import { useState, useEffect, useMemo, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useRoleStore } from "@/store/auth/roleStore";
import { useAuthStore } from "@/store/auth/index";
import { UserProfile } from "@/types/user.types";

// Define tipos para os valores de retorno do hook
interface UseAuthReturn {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  isAdmin: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  resetAuth: () => Promise<void>;
  debugAuth: () => Promise<any>;
  authTimeoutOccurred: boolean;
}

/**
 * Hook personalizado para gerenciar autenticação
 */
export function useAuth(): UseAuthReturn {
  // Utilizar os stores compostos
  const { 
    session, 
    user, 
    userProfile,
    isLoading, 
    initialized,
    error,
    refreshAuth,
    signOut: storeSignOut
  } = useAuthStore();
  
  // Pegar status admin do RoleStore
  const { isAdmin, isLoadingRole } = useRoleStore();
  
  // Estado para timeout de autenticação
  const [authTimeoutOccurred, setAuthTimeoutOccurred] = useState(false);
  
  // Inicializar autenticação na montagem
  useEffect(() => {
    if (!initialized) {
      console.log("useAuth - Inicializando autenticação");
      useAuthStore.getState().initialize().catch(err => {
        console.error("useAuth - Erro ao inicializar:", err);
      });
      
      // Adicionar timeout para detectar problemas de inicialização
      const timeoutId = setTimeout(() => {
        if (!useAuthStore.getState().initialized) {
          console.error("useAuth - TIMEOUT: Inicialização demorou demais");
          setAuthTimeoutOccurred(true);
        }
      }, 10000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [initialized]);
  
  // Função para debugar o estado da autenticação
  const debugAuth = useCallback(async () => {
    try {
      console.log("Auth Debug - Inicializando debug");
      
      // Verificar sessão atual diretamente pela API
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // Verificar usuário atual diretamente pela API
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      console.log("Auth Debug - Usuário atual:", userData);
      
      // Retornar todos os dados para inspeção
      return {
        session: sessionData,
        user: userData,
      };
    } catch (error) {
      console.error("Auth Debug - Erro:", error);
      return { error };
    }
  }, []);
  
  // Função para reiniciar autenticação
  const resetAuth = useCallback(async () => {
    try {
      console.log("useAuth - Reiniciando autenticação");
      await refreshAuth();
      setAuthTimeoutOccurred(false);
    } catch (error) {
      console.error("useAuth - Erro ao reiniciar:", error);
    }
  }, [refreshAuth]);
  
  // Função de signOut com navegação
  const signOut = useCallback(async () => {
    try {
      await storeSignOut();
      window.location.href = "/";
    } catch (error) {
      console.error("useAuth - Erro ao fazer logout:", error);
    }
  }, [storeSignOut]);
  
  // Calcular loading com base em todos os estados de carregamento
  const loading = useMemo(() => {
    return isLoading || isLoadingRole;
  }, [isLoading, isLoadingRole]);
  
  return {
    session,
    user,
    userProfile,
    loading,
    initialized,
    isAdmin,
    error,
    signOut,
    resetAuth,
    debugAuth,
    authTimeoutOccurred
  };
}
