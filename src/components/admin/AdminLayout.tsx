
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
  const { isAdmin, loading, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  useEffect(() => {
    if (!loading && requiresAdmin && !isAdmin) {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [loading, isAdmin, requiresAdmin, navigate, toast]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }
  
  if (requiresAdmin && !isAdmin) {
    return null; // Será redirecionado pelo useEffect
  }
  
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
