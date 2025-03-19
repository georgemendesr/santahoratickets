
import { VoucherDesigner } from "@/components/admin/VoucherDesigner";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const VoucherDesignerRoute = () => {
  const { session } = useAuth();
  const { isAdmin } = useRole(session);
  const navigate = useNavigate();
  
  // Redirecionar se não for admin
  if (!isAdmin) {
    navigate("/");
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
