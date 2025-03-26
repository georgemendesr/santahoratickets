
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { UserRoleType } from "@/types/user.types";

// Simple interface for the hook return type
interface UseRoleResult {
  role: UserRoleType | string;
  isAdmin: boolean;
  isLoading: boolean;
}

export function useRole(session: Session | null): UseRoleResult {
  // Local state that doesn't depend on Zustand
  const [roleState, setRoleState] = useState<UserRoleType | string>("user");
  
  // Use React Query for caching but with simplified pattern
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
          return null;
        }
        
        if (data) {
          console.log("useRole - Função verificada:", data.role);
          setRoleState(data.role);
          return data.role;
        }
        
        // Default role
        console.log("useRole - Nenhuma função encontrada, definindo como usuário padrão");
        setRoleState("user");
        return "user";
      } catch (err) {
        console.error("useRole - Exceção ao verificar função:", err);
        setRoleState("user");
        return "user";
      }
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    gcTime: 1000 * 60 * 10, // Manter no cache por 10 minutos
    retry: 1 // Limitar tentativas de retry
  });
  
  // Default when no session exists
  if (!session) {
    return {
      role: "user",
      isAdmin: false,
      isLoading: false
    };
  }
  
  return {
    role: roleState,
    isAdmin: roleState === "admin",
    isLoading
  };
}
