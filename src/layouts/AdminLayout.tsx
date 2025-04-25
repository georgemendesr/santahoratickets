
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { MainHeader } from '@/components/layout/MainHeader';
import { MainFooter } from '@/components/layout/MainFooter';
import { LogoHeader } from '@/components/layout/LogoHeader';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
}

export function AdminLayout({ children, requiresAdmin = true }: AdminLayoutProps) {
  const { session, isAdmin, loading, initialized, authTimeoutOccurred, resetAuth } = useAuth();
  const navigate = useNavigate();
  
  // Lidar com redirecionamento para usuários não autorizados
  useEffect(() => {
    // Só verificar autorização após inicialização completa e sem carregamento em andamento
    if (!loading && initialized) {
      console.log("AdminLayout - Autenticação inicializada. isAdmin:", isAdmin, "requiresAdmin:", requiresAdmin);
      
      if (requiresAdmin && !isAdmin) {
        console.log("AdminLayout - Usuário não autorizado, redirecionando");
        toast.error("Acesso restrito. Você não tem permissão para acessar esta página.", {
          description: "Redirecionando para a página inicial...",
          duration: 5000,
        });
        navigate('/');
      } else if (!session) {
        console.log("AdminLayout - Usuário não autenticado, redirecionando");
        toast.error("Você precisa estar logado para acessar esta página.", {
          description: "Redirecionando para a página de login...",
          duration: 5000,
        });
        navigate('/auth');
      } else {
        console.log("AdminLayout - Usuário autorizado, carregando dashboard");
      }
    }
  }, [loading, initialized, isAdmin, requiresAdmin, navigate, session]);
  
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center max-w-md w-full p-6">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-500"></div>
          <span className="mt-4 text-gray-600 font-medium">Verificando permissões...</span>
          
          <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: "60%" }}
            ></div>
          </div>
          
          {authTimeoutOccurred && (
            <div className="mt-8 flex flex-col items-center">
              <p className="text-red-500 mb-2">Parece que está demorando muito tempo.</p>
              <Button 
                variant="destructive" 
                onClick={resetAuth}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reiniciar autenticação
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Se já analisamos e ainda estamos aqui, permissão foi garantida
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <LogoHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <div className="flex w-full flex-col">
            <MainHeader />
            <SidebarInset>
              <div className="p-4 md:p-6">
                <div className="flex items-center mb-4">
                  <SidebarTrigger className="mr-2" />
                </div>
                {children}
              </div>
              <MainFooter />
            </SidebarInset>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function withAdminLayout<P extends object>(
  Component: React.ComponentType<P>,
  layoutProps: Omit<AdminLayoutProps, 'children'> = {}
) {
  return function WithAdminLayout(props: P) {
    return (
      <AdminLayout {...layoutProps}>
        <Component {...props} />
      </AdminLayout>
    );
  };
}
