
import { VoucherDesigner } from "@/components/admin/VoucherDesigner";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const VoucherDesignerRoute = () => {
  const { session, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionar se não for admin
  useEffect(() => {
    if (session && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate, session]);
  
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
