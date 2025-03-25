
import { useAuthStore } from "@/store/authStore";
import { Session } from "@supabase/supabase-js";
import { UserRole } from "@/types";

export function useRole(session: Session | null) {
  const { userRole, isAdmin } = useAuthStore();
  
  console.log("[useRole] Current role:", userRole, "Is admin?", isAdmin);

  return {
    role: userRole,
    isAdmin,
  };
}
