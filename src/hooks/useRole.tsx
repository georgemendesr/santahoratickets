
import { useAuthStore } from "@/store/authStore";
import { Session } from "@supabase/supabase-js";

export function useRole(session: Session | null) {
  const { userRole, isAdmin } = useAuthStore();
  
  // If no session, user has no roles
  if (!session) {
    return {
      role: "user",
      isAdmin: false
    };
  }
  
  return {
    role: userRole?.role || "user",
    isAdmin: Boolean(isAdmin),
  };
}
