
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { session } = useAuth();
  const { isAdmin } = useRole(session);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <div className="flex w-full flex-col">
          <MainHeader />
          <SidebarInset>
            <div className="p-4 md:p-6">
              <div className="flex items-center mb-4">
                <SidebarTrigger className="mr-2" />
              </div>
              <main className="mx-auto w-full max-w-7xl">{children}</main>
            </div>
            <MainFooter />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
