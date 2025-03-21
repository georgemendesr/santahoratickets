
import { MainHeader } from "./MainHeader";
import { MainFooter } from "./MainFooter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { isAdmin } = useRole(session);
  const [currentTab, setCurrentTab] = useState("/");

  useEffect(() => {
    // Atualiza a tab baseado na rota atual
    if (location.pathname === "/") setCurrentTab("/");
    else if (location.pathname === "/meus-vouchers") setCurrentTab("/vouchers");
    else if (location.pathname === "/recompensas") setCurrentTab("/rewards");
    else if (location.pathname.startsWith("/admin")) setCurrentTab("/admin");
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-gradient-to-r from-[#8B5CF6]/90 to-[#7C3AED]/90 text-center pt-6 pb-4 shadow-md">
        <img 
          src="/lovable-uploads/84e088a9-3b7b-41d9-9ef3-dd2894f717cf.png"
          alt="Santa Hora"
          className="h-16 mx-auto"
        />
      </div>
      
      <MainHeader />
      
      {/* Menu de navegação - só mostra se estiver logado */}
      {!loading && session && !isAdmin && (
        <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4">
            <Tabs value={currentTab} className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger 
                  value="/" 
                  onClick={() => navigate("/")}
                  className="data-[state=active]:bg-primary/10"
                >
                  Eventos
                </TabsTrigger>
                <TabsTrigger 
                  value="/vouchers" 
                  onClick={() => navigate("/meus-vouchers")}
                  className="data-[state=active]:bg-primary/10"
                >
                  Meus Vouchers
                </TabsTrigger>
                <TabsTrigger 
                  value="/rewards" 
                  onClick={() => navigate("/recompensas")}
                  className="data-[state=active]:bg-primary/10"
                >
                  Recompensas
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

      {/* Menu de navegação para admin */}
      {!loading && session && isAdmin && (
        <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4">
            <Tabs value={currentTab} className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger 
                  value="/admin" 
                  onClick={() => navigate("/admin")}
                  className="data-[state=active]:bg-primary/10"
                >
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

      <main className="flex-1">
        {children}
      </main>
      <MainFooter />
    </div>
  );
}
