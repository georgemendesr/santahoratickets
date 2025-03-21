
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { MainHeader } from '@/components/layout/MainHeader';
import { MainFooter } from '@/components/layout/MainFooter';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
}

export function AdminLayout({ children, requiresAdmin = true }: AdminLayoutProps) {
  const { session, isAdmin, loading, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  
  // Verificar autenticação ao montar
  useEffect(() => {
    console.log("AdminLayout inicializando, verificando autenticação...");
    
    const init = async () => {
      try {
        await checkAuth();
        setInitialized(true);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        toast({
          title: "Erro de autenticação",
          description: "Não foi possível verificar suas permissões",
          variant: "destructive",
        });
        setInitialized(true);
      }
    };
    
    init();
  }, [checkAuth, toast]);
  
  // Gerenciar estado de autenticação
  useEffect(() => {
    if (!initialized) return;
    
    console.log("Estado de autenticação:", { 
      loading, 
      isAdmin, 
      hasSession: !!session,
      initialized
    });
    
    if (!loading && requiresAdmin && !isAdmin) {
      console.log("Usuário não autorizado, redirecionando para home");
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [loading, isAdmin, requiresAdmin, navigate, toast, session, initialized]);
  
  // Estado de carregamento
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-amber-500"></div>
          <span className="mt-4 text-gray-600">Verificando permissões...</span>
        </div>
      </div>
    );
  }
  
  // Se usuário não está autorizado
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
  
  // Layout administrativo normal
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex w-full flex-col">
        <MainHeader />
        <div className="p-4 md:p-6 flex-1">
          {children}
        </div>
        <MainFooter />
      </div>
    </div>
  );
}
