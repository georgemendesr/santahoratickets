
import { create } from "zustand";
import { UserProfile } from "@/types/user.types";
import { supabase } from "@/integrations/supabase/client";

interface ProfileState {
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  profileError: Error | null;
  
  setUserProfile: (profile: UserProfile | null) => void;
  fetchUserProfile: (userId: string) => Promise<void>;
  clearUserProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  userProfile: null,
  isLoadingProfile: false,
  profileError: null,
  
  setUserProfile: (profile: UserProfile | null) => {
    set({ userProfile: profile });
  },
  
  fetchUserProfile: async (userId: string) => {
    try {
      set({ isLoadingProfile: true, profileError: null });
      console.log("ProfileStore - Buscando perfil do usuário");
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        console.log("ProfileStore - Perfil encontrado");
        set({ userProfile: data as UserProfile });
      } else {
        console.log("ProfileStore - Perfil não encontrado");
        set({ userProfile: null });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      set({ profileError: error as Error });
    } finally {
      set({ isLoadingProfile: false });
    }
  },
  
  clearUserProfile: () => {
    set({ userProfile: null });
  }
}));
