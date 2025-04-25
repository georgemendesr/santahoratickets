
import { useState, useEffect, useMemo, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user.types";
import { useSessionStore } from "@/store/auth/sessionStore";
import { useProfileStore } from "@/store/auth/profileStore";
import { useRoleStore } from "@/store/auth/roleStore";

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
  // Estados locais para armazenar informações da sessão e perfil
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [authTimeoutOccurred, setAuthTimeoutOccurred] = useState(false);
  
  // Acesso aos stores do Zustand
  const sessionStore = useSessionStore();
  const profileStore = useProfileStore();
  const roleStore = useRoleStore();
  
  // Inicializar autenticação na montagem
  useEffect(() => {
    if (!initialized) {
      console.log("useAuth - Inicializando autenticação");
      
      const initializeAuth = async () => {
        try {
          setLoading(true);
          
          // Buscar sessão atual
          const { data: sessionData } = await supabase.auth.getSession();
          setSession(sessionData.session);
          
          if (sessionData.session) {
            setUser(sessionData.session.user);
            
            // Buscar perfil do usuário
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', sessionData.session.user.id)
              .single();
              
            setUserProfile(profileData);
            
            // Buscar função/role do usuário
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', sessionData.session.user.id)
              .maybeSingle();
              
            setIsAdmin(roleData?.role === 'admin');
          }
          
          setInitialized(true);
          setLoading(false);
          
          // Configurar listener para mudanças de autenticação
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
              console.log("useAuth - Auth state changed:", event);
              setSession(newSession);
              setUser(newSession?.user || null);
              
              if (newSession?.user) {
                // Atualizar perfil e role quando sessão mudar
                const { data: profileData } = await supabase
                  .from('user_profiles')
                  .select('*')
                  .eq('id', newSession.user.id)
                  .single();
                  
                setUserProfile(profileData);
                
                const { data: roleData } = await supabase
                  .from('user_roles')
                  .select('role')
                  .eq('user_id', newSession.user.id)
                  .maybeSingle();
                  
                setIsAdmin(roleData?.role === 'admin');
              } else {
                setUserProfile(null);
                setIsAdmin(false);
              }
            }
          );
          
          return () => {
            authListener.subscription.unsubscribe();
          };
        } catch (err) {
          console.error("useAuth - Erro na inicialização:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
          setInitialized(true);
        }
      };
      
      initializeAuth();
      
      // Adicionar timeout para detectar problemas de inicialização
      const timeoutId = setTimeout(() => {
        if (!initialized) {
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
      setInitialized(false);
      setAuthTimeoutOccurred(false);
      setLoading(true);
      
      // Forçar a reinicialização da autenticação
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      
      if (sessionData.session) {
        setUser(sessionData.session.user);
        
        // Recarregar perfil e role
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
          
        setUserProfile(profileData);
        
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', sessionData.session.user.id)
          .maybeSingle();
          
        setIsAdmin(roleData?.role === 'admin');
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setInitialized(true);
      setLoading(false);
    } catch (error) {
      console.error("useAuth - Erro ao reiniciar:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      setInitialized(true);
      setLoading(false);
    }
  }, []);
  
  // Função de signOut com navegação
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setIsAdmin(false);
      window.location.href = "/";
    } catch (error) {
      console.error("useAuth - Erro ao fazer logout:", error);
    }
  }, []);
  
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
