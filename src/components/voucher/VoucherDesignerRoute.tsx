
import { VoucherDesigner } from "@/components/admin/VoucherDesigner";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleStore } from "@/store/auth/roleStore";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const VoucherDesignerRoute = () => {
  const { session } = useAuth();
  const { isAdmin } = useRoleStore();
  const navigate = useNavigate();
  
  // Atualizar o role ao carregar a página
  useEffect(() => {
    if (session?.user?.id) {
      useRoleStore.getState().fetchUserRole(session.user.id);
    }
  }, [session?.user?.id]);
  
  // Redirecionar se não for admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Designer de Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <VoucherDesigner />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VoucherDesignerRoute;
