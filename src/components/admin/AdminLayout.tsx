
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex w-full flex-col">
          <MainHeader />
          <SidebarInset>
            <div className="p-4 md:p-6">
              <div className="flex items-center mb-4">
                <SidebarTrigger className="mr-2" />
              </div>
              {children}
            </div>
            <MainFooter />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
