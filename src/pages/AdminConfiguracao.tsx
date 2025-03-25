
import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Star, ArrowUpRight, BellRing, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import ConfigHeader from "@/components/admin/config/ConfigHeader";
import PaymentsConfigTab from "@/components/admin/config/PaymentsConfigTab";
import LoyaltyConfigTab from "@/components/admin/config/LoyaltyConfigTab";
import ReferralsConfigTab from "@/components/admin/config/ReferralsConfigTab";
import NotificationsConfigTab from "@/components/admin/config/NotificationsConfigTab";
import SiteConfigTab from "@/components/admin/config/SiteConfigTab";

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
        <ConfigHeader onSave={handleSaveConfig} />

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
          
          <TabsContent value="payments">
            <PaymentsConfigTab />
          </TabsContent>
          
          <TabsContent value="site">
            <SiteConfigTab 
              siteInfo={siteInfo}
              socialMedia={socialMedia}
              setSiteInfo={setSiteInfo}
              setSocialMedia={setSocialMedia}
            />
          </TabsContent>
          
          <TabsContent value="loyalty">
            <LoyaltyConfigTab />
          </TabsContent>
          
          <TabsContent value="referrals">
            <ReferralsConfigTab />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsConfigTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminConfiguracao;
