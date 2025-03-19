
import { LayoutDashboard, CalendarDays, Users, Ticket, Tag, DollarSign, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/routes";
import { useNavigation } from "@/hooks/useNavigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
                  isActive={isActive(ROUTES.ADMIN.DASHBOARD)}
                >
                  <Link to={ROUTES.ADMIN.DASHBOARD}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive(ROUTES.ADMIN.EVENTS) || isActive(ROUTES.ADMIN.VOUCHERS) || isActive(ROUTES.ADMIN.PARTICIPANTS)}
                >
                  <Link to={ROUTES.ADMIN.EVENTS}>
                    <CalendarDays className="h-4 w-4" />
                    <span>Eventos</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActive(ROUTES.ADMIN.VOUCHERS)}
                    >
                      <Link to={ROUTES.ADMIN.VOUCHERS}>
                        <Ticket className="h-4 w-4" />
                        <span>Ingressos e Vouchers</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActive(ROUTES.ADMIN.PARTICIPANTS)}
                    >
                      <Link to={ROUTES.ADMIN.PARTICIPANTS}>
                        <Users className="h-4 w-4" />
                        <span>Participantes</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive(ROUTES.ADMIN.USERS)}
                >
                  <Link to={ROUTES.ADMIN.USERS}>
                    <Users className="h-4 w-4" />
                    <span>Usuários</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive(ROUTES.ADMIN.FINANCIAL)}
                >
                  <Link to={ROUTES.ADMIN.FINANCIAL}>
                    <DollarSign className="h-4 w-4" />
                    <span>Financeiro</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive(ROUTES.ADMIN.ANALYTICS)}
                >
                  <Link to={ROUTES.ADMIN.ANALYTICS}>
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
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
