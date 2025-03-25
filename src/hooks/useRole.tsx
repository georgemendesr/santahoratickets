
import { useAuthStore } from "@/store/authStore";
import { Session } from "@supabase/supabase-js";

export function useRole(session: Session | null) {
  const { userRole, isAdmin } = useAuthStore();
  
  return {
    role: userRole?.role || "user",
    isAdmin,
  };
}
