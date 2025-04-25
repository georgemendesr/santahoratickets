
import { AdminLayout } from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/useNavigation";
import { ArrowLeft } from "lucide-react";

const ManualOrderRoute = () => {
  const { session, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { goToAdminVouchers } = useNavigation();
  
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
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-4" 
          onClick={goToAdminVouchers}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Manuais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Nesta tela você poderá registrar pedidos feitos manualmente (vendas presenciais, 
              transferências bancárias, etc). Esta funcionalidade será implementada em breve.
            </p>
            
            <div className="border rounded-md p-8 text-center text-muted-foreground">
              Funcionalidade em desenvolvimento
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ManualOrderRoute;
