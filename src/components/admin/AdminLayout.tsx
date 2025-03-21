
import { useEffect } from 'react';
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
  const { isAdmin, loading, checkAuth, session } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Always ensure auth is checked on mount
  useEffect(() => {
    console.log("Admin layout mounting, checking auth...");
    checkAuth();
  }, [checkAuth]);
  
  // Handle auth state changes
  useEffect(() => {
    console.log("Auth state in AdminLayout:", { loading, isAdmin, hasSession: !!session });
    
    // Only redirect when loading is complete AND user is not admin (if required)
    if (!loading && requiresAdmin && !isAdmin) {
      console.log("User not authorized, redirecting to home");
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [loading, isAdmin, requiresAdmin, navigate, toast, session]);
  
  // Simple loading display
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-amber-500"></div>
        <span className="ml-3">Verificando permissões...</span>
      </div>
    );
  }
  
  // If user is not authorized and we're still on this page (before redirect takes effect)
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
  
  // Normal admin layout rendering
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
