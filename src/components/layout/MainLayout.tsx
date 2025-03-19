
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

  console.log("MainLayout Render:", {
    session,
    loading,
    isAdmin,
    currentTab,
    pathname: location.pathname
  });

  useEffect(() => {
    // Atualiza a tab baseado na rota atual
    if (location.pathname === "/") setCurrentTab("/");
    else if (location.pathname === "/vouchers") setCurrentTab("/vouchers");
    else if (location.pathname === "/rewards") setCurrentTab("/rewards");
    else if (location.pathname.startsWith("/admin")) setCurrentTab("/admin");
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
                  onClick={() => navigate("/vouchers")}
                  className="data-[state=active]:bg-primary/10"
                >
                  Meus Vouchers
                </TabsTrigger>
                <TabsTrigger 
                  value="/rewards" 
                  onClick={() => navigate("/rewards")}
                  className="data-[state=active]:bg-primary/10"
                >
                  Recompensas
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

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
