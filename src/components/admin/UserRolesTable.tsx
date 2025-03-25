
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserRoleType } from "@/types/user.types";
import { toast } from "sonner";

interface UserWithRole {
  id: string;
  email: string;
  name: string | null;
  role: UserRoleType;
  role_id: string;
}

export function UserRolesTable() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Primeiro, buscar todos os usuários
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('id, email, name');
        
        if (userError) throw userError;
        
        // Depois, buscar os papéis dos usuários
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('*');
          
        if (roleError) throw roleError;
        
        // Combinar os dados
        const combinedData = userData.map(user => {
          const userRole = roleData.find(role => role.user_id === user.id);
          return {
            id: user.id,
            email: user.email || '',
            name: user.name,
            role: userRole?.role || 'user',
            role_id: userRole?.id || ''
          };
        });
        
        setUsers(combinedData);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        toast.error('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const updateUserRole = async (userId: string, roleId: string | null, newRole: UserRoleType) => {
    try {
      if (roleId) {
        // Atualizar papel existente
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('id', roleId);
          
        if (error) throw error;
      } else {
        // Criar novo papel
        const { error } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: userId,
            role: newRole
          });
          
        if (error) throw error;
      }
      
      // Atualizar estado local
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, role: newRole } 
            : user
        )
      );
      
      toast.success(`Papel do usuário atualizado para ${newRole}`);
    } catch (error) {
      console.error('Erro ao atualizar papel:', error);
      toast.error('Erro ao atualizar papel do usuário');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Papéis</CardTitle>
        <CardDescription>Controle os papéis e permissões dos usuários do sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Carregando usuários...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || 'Sem nome'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.role === 'admin' ? 'destructive' : 'outline'}
                    >
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={user.role}
                      onValueChange={(value) => 
                        updateUserRole(
                          user.id, 
                          user.role_id, 
                          value as UserRoleType
                        )
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecionar papel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
