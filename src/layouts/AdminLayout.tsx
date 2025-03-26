
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { MainHeader } from '@/components/layout/MainHeader';
import { MainFooter } from '@/components/layout/MainFooter';
import { LogoHeader } from '@/components/layout/LogoHeader';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
}

export function AdminLayout({ children, requiresAdmin = true }: AdminLayoutProps) {
  const { isAdmin, loading, initialized, session, debugAuth } = useAuth();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  
  // Debug authentication on component mount
  useEffect(() => {
    const debug = async () => {
      console.log("AdminLayout - Debugging auth state");
      const result = await debugAuth();
      console.log("AdminLayout - Auth debug result:", result);
    };
    
    debug();
  }, [debugAuth]);
  
  // Verificar permissões após inicialização da autenticação
  useEffect(() => {
    if (!loading && initialized) {
      console.log("AdminLayout - Autenticação inicializada. isAdmin:", isAdmin, "requiresAdmin:", requiresAdmin);
      setIsVerifying(false);
      
      if (requiresAdmin && !isAdmin) {
        console.log("AdminLayout - Usuário não autorizado, redirecionando");
        toast("Acesso restrito. Você não tem permissão para acessar esta página.", {
          description: "Redirecionando para a página inicial...",
          duration: 5000,
        });
        navigate('/');
      } else {
        console.log("AdminLayout - Usuário autorizado, carregando dashboard");
      }
    }
  }, [loading, initialized, isAdmin, requiresAdmin, navigate]);
  
  // Mostrar estado de carregamento
  if (loading || isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-500"></div>
          <span className="mt-4 text-gray-600">Verificando permissões...</span>
          <span className="mt-2 text-sm text-gray-400">
            {loading ? "Carregando autenticação..." : "Verificando perfil de administrador..."}
          </span>
        </div>
      </div>
    );
  }
  
  // Se o usuário não tem permissão de administrador
  if (requiresAdmin && !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-2">Acesso não autorizado</p>
          <p className="text-gray-500">Redirecionando...</p>
        </div>
      </div>
    );
  }
  
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

// Higher-Order Component (HOC) to add AdminLayout to a component
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
