import { useAuthStore } from "./authStore";
import { useSessionStore } from "./sessionStore";
import { useProfileStore } from "./profileStore";
import { useRoleStore } from "./roleStore";

// Export a unified interface that maintains the same API as the original authStore
export const useAuthStoreComposed = () => {
  const authStore = useAuthStore();
  const sessionStore = useSessionStore();
  const profileStore = useProfileStore();
  const roleStore = useRoleStore();
  
  return {
    // Session data
    session: sessionStore.session,
    user: sessionStore.user,
    
    // Profile data
    userProfile: profileStore.userProfile,
    
    // Role data
    userRole: roleStore.userRole,
    isAdmin: roleStore.isAdmin,
    
    // Loading states
    isLoading: authStore.isLoading || sessionStore.isLoading || profileStore.isLoadingProfile || roleStore.isLoadingRole,
    initialized: authStore.initialized,
    
    // Error states
    error: authStore.error || sessionStore.error || profileStore.profileError || roleStore.roleError,
    
    // Methods
    setSession: sessionStore.setSession,
    setUserProfile: profileStore.setUserProfile,
    setUserRole: roleStore.setUserRole,
    initialize: authStore.initialize,
    signOut: authStore.signOut,
    refreshAuth: authStore.refreshAuth,
  };
};

// For backward compatibility, keep the same name
export const useAuthStore = useAuthStoreComposed;
