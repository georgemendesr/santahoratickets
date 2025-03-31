
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { UserRoleType } from "@/types/user.types";

// Interface para o retorno do hook
interface UseRoleResult {
  role: UserRoleType | string;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useRole(session: Session | null): UseRoleResult {
  const [roleState, setRoleState] = useState<UserRoleType | string>("user");
  const [isAdminState, setIsAdminState] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<Error | null>(null);
  
  // Usar React Query para cache, com padrão simplificado
  const { isLoading } = useQuery({
    queryKey: ['userRole', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      console.log("useRole - Verificando função do usuário", session.user.id);
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("useRole - Erro ao verificar função:", error);
          setErrorState(new Error(error.message));
          return null;
        }
        
        if (data) {
          console.log("useRole - Função verificada:", data.role);
          setRoleState(data.role);
          setIsAdminState(data.role === 'admin');
          return data.role;
        }
        
        // Papel padrão
        console.log("useRole - Nenhuma função encontrada, definindo como usuário padrão");
        setRoleState("user");
        setIsAdminState(false);
        return "user";
      } catch (err) {
        console.error("useRole - Exceção ao verificar função:", err);
        setErrorState(err instanceof Error ? err : new Error(String(err)));
        setRoleState("user");
        setIsAdminState(false);
        return "user";
      }
    },
    enabled: !!session?.user?.id,
    staleTime: 0, // Forçar revalidação a cada montagem
    gcTime: 1000 * 60 * 5, // Manter no cache por 5 minutos
    retry: 1, // Limitar tentativas de retry
    refetchOnWindowFocus: true, // Recarregar ao focar na janela
    refetchOnMount: true, // Recarregar ao montar o componente
  });
  
  // Log para depuração
  useEffect(() => {
    console.log("useRole - Estado atual:", { 
      role: roleState, 
      isAdmin: isAdminState, 
      session: !!session,
      userId: session?.user?.id 
    });
  }, [roleState, isAdminState, session]);
  
  // Default quando não existe sessão
  if (!session) {
    return {
      role: "user",
      isAdmin: false,
      isLoading: false,
      error: null
    };
  }
  
  return {
    role: roleState,
    isAdmin: isAdminState,
    isLoading,
    error: errorState
  };
}
