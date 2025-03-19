
import { LayoutDashboard, CalendarDays, Users, Ticket, Tag, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive("/admin")}
                >
                  <Link to="/admin">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive("/admin/eventos")}
                >
                  <Link to="/admin/eventos">
                    <CalendarDays className="h-4 w-4" />
                    <span>Eventos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive("/admin/usuarios")}
                >
                  <Link to="/admin/users">
                    <Users className="h-4 w-4" />
                    <span>Usuários</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive("/admin/vouchers")}
                >
                  <Link to="/admin/vouchers">
                    <Ticket className="h-4 w-4" />
                    <span>Vouchers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive("/admin/participants")}
                >
                  <Link to="/admin/participants">
                    <Tag className="h-4 w-4" />
                    <span>Participantes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive("/admin/financeiro")}
                >
                  <Link to="/admin/financeiro">
                    <DollarSign className="h-4 w-4" />
                    <span>Financeiro</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
