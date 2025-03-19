
import { useAuthStore } from "@/store/authStore";
import { Session } from "@supabase/supabase-js";
import { UserRole } from "@/types";

export function useRole(session: Session | null) {
  const { role, isAdmin } = useAuthStore();
  
  console.log("[useRole] Current role:", role, "Is admin?", isAdmin);

  return {
    role: role as UserRole,
    isAdmin,
  };
}
