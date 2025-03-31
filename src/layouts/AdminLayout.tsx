
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { MainHeader } from '@/components/layout/MainHeader';
import { MainFooter } from '@/components/layout/MainFooter';
import { LogoHeader } from '@/components/layout/LogoHeader';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from '@/hooks/useAuth';
import { useRoleStore } from '@/store/auth/roleStore';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface AdminLayoutProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
}

export function AdminLayout({ children, requiresAdmin = true }: AdminLayoutProps) {
  const auth = useAuth();
  const { isAdmin, isLoadingRole: roleLoading } = useRoleStore();
    
  const { loading: authLoading, initialized, session, debugAuth, resetAuth, authTimeoutOccurred } = auth;
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationTimeoutOccurred, setVerificationTimeoutOccurred] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Verificando autenticação...");
  const [loadingStage, setLoadingStage] = useState(0);
  
  // Debug authentication state on mount
  useEffect(() => {
    const debug = async () => {
      console.log("AdminLayout - Debugging auth state");
      const result = await debugAuth();
      console.log("AdminLayout - Auth debug result:", result);
    };
    
    debug();
  }, [debugAuth]);
  
  // Atualizar o role ao carregar a página
  useEffect(() => {
    if (session?.user?.id) {
      useRoleStore.getState().fetchUserRole(session.user.id);
    }
  }, [session?.user?.id]);
  
  // Show different loading messages
  useEffect(() => {
    if (authLoading || roleLoading || !initialized) {
      const stages = [
        "Verificando autenticação...",
        "Carregando perfil de usuário...",
        "Verificando permissões...",
        "Finalizando carregamento..."
      ];
      
      const interval = setInterval(() => {
        setLoadingStage(prev => {
          const newStage = prev < stages.length - 1 ? prev + 1 : prev;
          setLoadingMessage(stages[newStage]);
          return newStage;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [authLoading, roleLoading, initialized]);
  
  // Timeout for verification
  useEffect(() => {
    let verificationTimeoutId: NodeJS.Timeout;
    
    if (authLoading || roleLoading || !initialized) {
      verificationTimeoutId = setTimeout(() => {
        console.error("AdminLayout - TIMEOUT: Verificação de permissões demorou demais");
        setVerificationTimeoutOccurred(true);
        setIsVerifying(false);
      }, 10000); // Increased from 5s to 10s
    }
    
    return () => {
      if (verificationTimeoutId) clearTimeout(verificationTimeoutId);
    };
  }, [authLoading, roleLoading, initialized]);
  
  // Handle redirect for non-admin users
  useEffect(() => {
    if (!authLoading && !roleLoading && initialized) {
      console.log("AdminLayout - Autenticação inicializada. isAdmin:", isAdmin, "requiresAdmin:", requiresAdmin);
      setIsVerifying(false);
      
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
  }, [authLoading, roleLoading, initialized, isAdmin, requiresAdmin, navigate, session]);
  
  if (authLoading || roleLoading || isVerifying) {
    const showEmergencyButton = authTimeoutOccurred || verificationTimeoutOccurred;
    
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center max-w-md w-full p-6">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-500"></div>
          <span className="mt-4 text-gray-600 font-medium">{loadingMessage}</span>
          
          <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min((loadingStage + 1) * 25, 100)}%` }}
            ></div>
          </div>
          
          <div className="w-full mt-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          
          {showEmergencyButton && (
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
