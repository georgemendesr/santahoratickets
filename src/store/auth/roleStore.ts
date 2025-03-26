
import { create } from "zustand";
import { UserRole, UserRoleType } from "@/types/user.types";
import { supabase } from "@/integrations/supabase/client";

interface RoleState {
  userRole: UserRole | null;
  isAdmin: boolean;
  isLoadingRole: boolean;
  roleError: Error | null;
  
  setUserRole: (role: UserRole | null) => void;
  fetchUserRole: (userId: string) => Promise<void>;
  clearUserRole: () => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  userRole: null,
  isAdmin: false,
  isLoadingRole: false,
  roleError: null,
  
  setUserRole: (role: UserRole | null) => {
    const isAdmin = role?.role === 'admin';
    console.log("RoleStore - Atualizando role para:", role?.role, "isAdmin:", isAdmin);
    set({ userRole: role, isAdmin });
  },
  
  fetchUserRole: async (userId: string) => {
    try {
      set({ isLoadingRole: true, roleError: null });
      console.log("RoleStore - Buscando papel do usuário");
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        console.log("RoleStore - Papel encontrado:", data.role);
        const userRole: UserRole = {
          id: data.id,
          user_id: data.user_id,
          role: data.role as UserRoleType,
          created_at: data.created_at
        };
        set({ userRole, isAdmin: data.role === 'admin' });
      } else {
        console.log("RoleStore - Nenhum papel encontrado, definindo como usuário padrão");
        set({ 
          userRole: {
            id: '',
            user_id: userId,
            role: 'user'
          },
          isAdmin: false
        });
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      set({ roleError: error as Error });
    } finally {
      set({ isLoadingRole: false });
    }
  },
  
  clearUserRole: () => {
    set({ userRole: null, isAdmin: false });
  }
}));
