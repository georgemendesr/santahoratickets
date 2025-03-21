
import { useEffect, useState, useCallback } from 'react';
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
  const [authChecked, setAuthChecked] = useState(false);
  
  // Executamos a verificação de autenticação apenas uma vez ao montar o componente
  useEffect(() => {
    console.log("AdminLayout - Montando componente");
    
    if (!authChecked) {
      const initAuth = async () => {
        try {
          console.log("AdminLayout - Iniciando verificação de autenticação");
          await checkAuth();
          console.log("AdminLayout - Autenticação verificada com sucesso");
          setInitialized(true);
          setAuthChecked(true);
        } catch (error) {
          console.error("AdminLayout - Erro ao verificar autenticação:", error);
          toast({
            title: "Erro de autenticação",
            description: "Não foi possível verificar suas permissões",
            variant: "destructive",
          });
          setInitialized(true);
          setAuthChecked(true);
        }
      };
      
      initAuth();
    }
    
    // Essa função de cleanup é importante para prevenir memory leaks
    return () => {
      console.log("AdminLayout - Desmontando componente");
    };
  }, [checkAuth, toast, authChecked]);
  
  // Efeito separado para lidar com redirecionamento
  useEffect(() => {
    if (!initialized) return;
    
    // Lógica para redirecionar se necessário, apenas após inicialização
    if (!loading && requiresAdmin && !isAdmin) {
      console.log("AdminLayout - Usuário não autorizado, redirecionando");
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [loading, isAdmin, requiresAdmin, navigate, toast, initialized]);
  
  // Mostra o estado de carregamento
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-500"></div>
          <span className="mt-4 text-gray-600">Verificando permissões...</span>
        </div>
      </div>
    );
  }
  
  // Se usuário não está autorizado, mostra mensagem temporária (será redirecionado)
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
