
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useRole(session: Session | null) {
  const { userRole, isAdmin, setUserRole } = useAuthStore();
  const [roleVerified, setRoleVerified] = useState(false);
  
  // Utilizar React Query para cache eficiente das verificações de função
  const { data: cachedRole, isLoading: isCheckingRole } = useQuery({
    queryKey: ['userRole', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      console.log("useRole - Verificando função do usuário via React Query", session.user.id);
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("useRole - Erro ao verificar função:", error);
          return null;
        }
        
        if (data) {
          console.log("useRole - Função verificada via React Query:", data.role);
          // Atualizar o estado global quando verificado com sucesso
          if (!roleVerified) {
            setRoleVerified(true);
          }
          return data.role;
        }
        
        return 'user'; // Default role
      } catch (err) {
        console.error("useRole - Exceção ao verificar função:", err);
        return 'user'; // Default em caso de erro
      }
    },
    enabled: !!session?.user?.id && !roleVerified,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    cacheTime: 1000 * 60 * 10, // Manter no cache por 10 minutos
    retry: 1, // Limitar tentativas de retry para evitar loops
    onSuccess: (data) => {
      // Atualizar o estado global somente se for diferente
      if (data && userRole?.role !== data) {
        setUserRole({
          id: '',
          user_id: session?.user?.id || '',
          role: data as any
        });
      }
    }
  });
  
  // Se não há sessão, o usuário não tem função
  if (!session) {
    return {
      role: "user",
      isAdmin: false,
      isLoading: false
    };
  }
  
  return {
    role: userRole?.role || cachedRole || "user",
    isAdmin: Boolean(isAdmin),
    isLoading: isCheckingRole
  };
}
