
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { MainHeader } from '@/components/layout/MainHeader';
import { MainFooter } from '@/components/layout/MainFooter';
import { LogoHeader } from '@/components/layout/LogoHeader';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
}

export function AdminLayout({ children, requiresAdmin = true }: AdminLayoutProps) {
  const { isAdmin, isLoading, initialize, session } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check authentication when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("AdminLayout - Checking authentication");
        await initialize();
        console.log("AdminLayout - Authentication verified successfully");
      } catch (error) {
        console.error("AdminLayout - Authentication verification error:", error);
      }
    };
    
    checkAuth();
  }, [initialize]);
  
  // Handle authorization redirection separately
  useEffect(() => {
    if (!isLoading && requiresAdmin && !isAdmin) {
      console.log("AdminLayout - User not authorized, redirecting");
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isLoading, isAdmin, requiresAdmin, navigate, toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-500"></div>
          <span className="mt-4 text-gray-600">Verificando permissões...</span>
        </div>
      </div>
    );
  }
  
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
