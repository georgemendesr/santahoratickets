
import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/types/user.types";

interface UserRoleTableItem {
  id: string;
  user_id: string;
  role: 'admin' | 'user' | 'staff';
  created_at?: string;
  user_email?: string;
  user_name?: string;
}

export function UserRolesTable() {
  const [userRoles, setUserRoles] = useState<UserRoleTableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUserRoles();
  }, []);
  
  async function fetchUserRoles() {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          user_profiles:user_id (
            email,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedData = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        role: item.role as 'admin' | 'user' | 'staff',
        created_at: item.created_at,
        user_email: item.user_profiles?.email,
        user_name: item.user_profiles?.name
      }));
      
      setUserRoles(formattedData);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast.error('Falha ao carregar papéis dos usuários');
    } finally {
      setIsLoading(false);
    }
  }
  
  async function updateUserRole(userId: string, roleId: string, newRole: 'admin' | 'user' | 'staff') {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('id', roleId);
      
      if (error) throw error;
      
      // Update local state
      setUserRoles(prevRoles => 
        prevRoles.map(role => 
          role.id === roleId ? { ...role, role: newRole } : role
        )
      );
      
      toast.success('Papel do usuário atualizado com sucesso');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Falha ao atualizar papel do usuário');
    }
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userRoles.map(role => (
            <TableRow key={role.id}>
              <TableCell>
                <div className="font-medium">{role.user_name || 'Sem nome'}</div>
                <div className="text-sm text-muted-foreground">{role.user_email}</div>
              </TableCell>
              <TableCell>
                <Badge variant={role.role === 'admin' ? 'destructive' : role.role === 'staff' ? 'outline' : 'secondary'}>
                  {role.role}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Select
                  value={role.role}
                  onValueChange={(value: string) => updateUserRole(role.user_id, role.id, value as 'admin' | 'user' | 'staff')}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          
          {userRoles.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
