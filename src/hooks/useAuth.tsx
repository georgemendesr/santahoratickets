
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuth() {
  const { 
    session, 
    isLoading,
    error, 
    initialize, 
    signOut, 
    refreshAuth,
    isAdmin,
    userProfile
  } = useAuthStore();
  
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize authentication on first render
  useEffect(() => {
    if (!authInitialized) {
      try {
        initialize();
        setAuthInitialized(true);
      } catch (err) {
        console.error("Failed to initialize authentication:", err);
        toast.error("Falha ao inicializar autenticação");
      }
    }
  }, [initialize, authInitialized]);

  // Debug function to help troubleshoot auth issues
  const debugAuth = async () => {
    try {
      const sessionResult = await supabase.auth.getSession();
      console.log("Current session:", sessionResult);
      
      const userResult = await supabase.auth.getUser();
      console.log("Current user:", userResult);
      
      return { session: sessionResult, user: userResult };
    } catch (error) {
      console.error("Error debugging authentication:", error);
      return { error };
    }
  };

  return {
    session,
    loading: isLoading,
    error,
    signOut,
    debugAuth,
    refreshSession: refreshAuth,
    isAdmin,
    initialized: authInitialized,
    userProfile
  };
}
