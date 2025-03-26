
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useRole(session: Session | null) {
  const { userRole, isAdmin } = useAuthStore();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  
  // Verificação de segurança adicional para confirmar o papel do usuário
  // apenas se ainda não foi verificado
  useEffect(() => {
    if (session && !roleChecked && !isCheckingRole && !userRole) {
      setIsCheckingRole(true);
      
      const verifyUserRole = async () => {
        try {
          console.log("useRole - Verificando função do usuário", session.user.id);
          
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (error) {
            console.error("useRole - Erro ao verificar função:", error);
          } else if (data) {
            console.log("useRole - Função verificada:", data.role);
          }
          
          setRoleChecked(true);
        } catch (err) {
          console.error("useRole - Exceção ao verificar função:", err);
        } finally {
          setIsCheckingRole(false);
        }
      };
      
      verifyUserRole();
    } else if (userRole) {
      // Se já temos o userRole, marcar como verificado
      setRoleChecked(true);
    }
  }, [session, roleChecked, isCheckingRole, userRole]);
  
  // Se não há sessão, o usuário não tem função
  if (!session) {
    return {
      role: "user",
      isAdmin: false,
      isLoading: isCheckingRole
    };
  }
  
  return {
    role: userRole?.role || "user",
    isAdmin: Boolean(isAdmin),
    isLoading: isCheckingRole
  };
}
