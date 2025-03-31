
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, UserCog, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function DiagnosticPage() {
  const { session, user, isAdmin, loading, userProfile } = useAuth();
  const [userRolesData, setUserRolesData] = useState<any>(null);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  
  // Buscar os papéis diretamente da tabela
  const fetchUserRoles = async () => {
    if (!user?.id) return;
    
    setIsLoadingRoles(true);
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setUserRolesData(data);
    } catch (error) {
      console.error("Erro ao buscar papéis:", error);
    } finally {
      setIsLoadingRoles(false);
    }
  };
  
  useEffect(() => {
    if (user?.id) {
      fetchUserRoles();
    }
  }, [user?.id]);
  
  // Função para promover usuário a administrador
  const promoteToAdmin = async () => {
    if (!user?.id) return;
    
    setIsFixing(true);
    
    try {
      if (userRolesData && userRolesData.length > 0) {
        // Atualizar papel existente
        const { error } = await supabase
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        // Criar novo papel de administrador
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'admin'
          });
          
        if (error) throw error;
      }
      
      toast.success("Permissão de administrador concedida com sucesso!");
      // Recarregar dados
      fetchUserRoles();
      // Recarregar a página para atualizar o estado da autenticação
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      toast.error("Erro ao promover usuário para administrador.");
    } finally {
      setIsFixing(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Diagnóstico de Usuário</h1>
        
        {!session ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Não autenticado</AlertTitle>
            <AlertDescription>
              Você não está autenticado. Por favor, faça login para verificar suas permissões.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status de Autenticação</CardTitle>
                <CardDescription>Informações da sua sessão atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Autenticado:</span>
                    <span className="text-green-600 font-medium flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Sim
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">ID do Usuário:</span>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{user?.id}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Status de Administrador</CardTitle>
                <CardDescription>Informações sobre seus papéis e permissões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">É Admin (via Hook):</span>
                    {isAdmin ? (
                      <span className="text-green-600 font-medium flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Sim
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium flex items-center">
                        <ShieldAlert className="h-4 w-4 mr-1" /> Não
                      </span>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Registros da tabela user_roles:</h3>
                    {isLoadingRoles ? (
                      <div className="flex items-center justify-center h-20">
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                      </div>
                    ) : userRolesData && userRolesData.length > 0 ? (
                      <div className="bg-muted p-3 rounded">
                        {userRolesData.map((role: any, index: number) => (
                          <div key={index} className="text-sm font-mono">
                            {JSON.stringify(role, null, 2)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertTitle>Nenhum papel encontrado</AlertTitle>
                        <AlertDescription>
                          Você não possui nenhum registro na tabela de papéis.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={promoteToAdmin}
                    disabled={isFixing || (userRolesData && userRolesData.some((r: any) => r.role === 'admin'))}
                    className="w-full"
                  >
                    {isFixing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-background mr-2"></div>
                        Promovendo...
                      </>
                    ) : (
                      <>
                        <UserCog className="h-4 w-4 mr-2" />
                        {userRolesData && userRolesData.some((r: any) => r.role === 'admin')
                          ? "Você já é administrador"
                          : "Promover para Administrador"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informações de Depuração</CardTitle>
                <CardDescription>Detalhes técnicos para diagnóstico</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-medium">Dados do Perfil:</h3>
                    <pre className="bg-muted p-3 rounded text-xs mt-1 overflow-auto max-h-40">
                      {JSON.stringify(userProfile, null, 2)}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Dados da Sessão:</h3>
                    <pre className="bg-muted p-3 rounded text-xs mt-1 overflow-auto max-h-40">
                      {JSON.stringify(session, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Atualizar Página
              </Button>
              <Button onClick={() => window.location.href = "/admin"}>
                Tentar Acessar Dashboard Admin
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
