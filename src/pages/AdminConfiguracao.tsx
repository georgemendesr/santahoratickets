
import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  Star, 
  ArrowUpRight, 
  BellRing, 
  Globe,
  Facebook,
  Instagram
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TestCredentialsCard from "@/components/admin/payment/TestCredentialsCard";

const AdminConfiguracao = () => {
  const { toast } = useToast();
  const [siteInfo, setSiteInfo] = useState({
    name: "Santa Hora Bar",
    logoUrl: "https://qTypZzGjeBvFciHiyNt.supabase.co/storage/v1/object/public/base44-prod/public/eaf",
    primaryColor: "#ffcd00",
    email: "contato@santahorabar.com.br",
    phone: "+5586999999999"
  });
  
  const [socialMedia, setSocialMedia] = useState({
    facebook: "https://facebook.com/santahorabar",
    instagram: "https://instagram.com/santahorabar"
  });

  const handleSaveConfig = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso",
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Configurações do Sistema</h1>
            <p className="text-gray-500 mt-1">Gerencie as configurações da plataforma</p>
          </div>
          <Button 
            onClick={handleSaveConfig}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Salvar Configurações
          </Button>
        </div>

        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Fidelidade
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Indicações
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="site" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Site
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Configurações de Pagamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-md flex items-start gap-3 mb-4">
                      <div className="bg-green-100 rounded-full p-2 mt-1">
                        <CreditCard className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Mercado Pago</h4>
                        <p className="text-sm text-green-700">Integração ativa</p>
                      </div>
                      <Button variant="outline" className="ml-auto" size="sm">
                        Configurar
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md flex items-start gap-3">
                      <div className="bg-gray-100 rounded-full p-2 mt-1">
                        <CreditCard className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Outras integrações</h4>
                        <p className="text-sm text-gray-500">PagSeguro, PayPal, Stripe</p>
                      </div>
                      <Button variant="outline" className="ml-auto" size="sm">
                        Ver opções
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <TestCredentialsCard />
            </div>
          </TabsContent>
          
          <TabsContent value="site" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Informações do Site</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nome do Site</label>
                    <Input 
                      value={siteInfo.name} 
                      onChange={(e) => setSiteInfo({...siteInfo, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">URL do Logo</label>
                    <Input 
                      value={siteInfo.logoUrl} 
                      onChange={(e) => setSiteInfo({...siteInfo, logoUrl: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Cor Primária</label>
                    <div className="flex gap-3">
                      <div 
                        className="w-10 h-10 rounded border" 
                        style={{backgroundColor: siteInfo.primaryColor}}
                      />
                      <Input 
                        value={siteInfo.primaryColor} 
                        onChange={(e) => setSiteInfo({...siteInfo, primaryColor: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email de Contato</label>
                    <Input 
                      value={siteInfo.email} 
                      onChange={(e) => setSiteInfo({...siteInfo, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Telefone de Contato</label>
                    <Input 
                      value={siteInfo.phone} 
                      onChange={(e) => setSiteInfo({...siteInfo, phone: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Redes Sociais e Integrações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      URL do Facebook
                    </label>
                    <Input 
                      value={socialMedia.facebook} 
                      onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      URL do Instagram
                    </label>
                    <Input 
                      value={socialMedia.instagram} 
                      onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="loyalty">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Programa de Fidelidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configurações do programa de fidelidade em desenvolvimento.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="referrals">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Sistema de Indicações</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configurações do sistema de indicações em desenvolvimento.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configurações de notificações em desenvolvimento.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminConfiguracao;
