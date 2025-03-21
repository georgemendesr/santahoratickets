
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Users,
  User,
  Gift,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    label: "Dashboard"
  },
  {
    href: "/admin/eventos",
    icon: CalendarDays,
    label: "Eventos"
  },
  {
    href: "/admin/vouchers",
    icon: Ticket,
    label: "Vouchers"
  },
  {
    href: "/admin/participantes",
    icon: Users,
    label: "Participantes"
  },
  {
    href: "/admin/usuarios",
    icon: User,
    label: "Usuários"
  },
  {
    href: "/admin/indicacoes",
    icon: Gift,
    label: "Indicações"
  },
  {
    href: "/admin/analytics",
    icon: BarChart3,
    label: "Analytics"
  },
  {
    href: "/admin/configuracao",
    icon: Settings,
    label: "Configuração"
  }
];

export function AdminSidebar() {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border min-h-screen flex flex-col bg-gradient-to-b from-background/95 to-blue-50/30 backdrop-blur-md">
      <div className="p-6">
        <img 
          src="/lovable-uploads/0791f14f-3770-44d6-8ff3-1e714a1d1243.png"
          alt="Bora Pagodear" 
          className="h-10 mx-auto"
        />
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = location.pathname === link.href || 
                           (link.href !== "/admin" && location.pathname.startsWith(link.href));
            
            return (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                    isActive
                      ? "bg-blue-100/50 dark:bg-blue-800/30 text-foreground font-medium"
                      : "hover:bg-muted"
                  )
                }
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-border mt-auto">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-start" 
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
