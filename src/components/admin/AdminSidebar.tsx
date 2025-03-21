
import { Link, useLocation } from "react-router-dom";
import { CalendarDays, TicketIcon, Users, DollarSign, BarChart3, Gift, ArrowUpRight, LayoutDashboard, Settings } from "lucide-react";
import { ROUTES } from "@/routes";

export function AdminSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <Link to="/" className="flex items-center">
          <img src="/lovable-uploads/8eb8e413-1ab9-489d-a7a2-e8bfa9f4b28c.png" alt="Santa Hora" className="h-8" />
        </Link>
      </div>
      
      <nav className="py-4">
        <ul className="space-y-1">
          <MenuItem 
            icon={<CalendarDays className="h-5 w-5" />} 
            label="Eventos" 
            to={ROUTES.ADMIN.EVENTS} 
            isActive={isActive(ROUTES.ADMIN.EVENTS)} 
          />
          
          <MenuItem 
            icon={<TicketIcon className="h-5 w-5" />} 
            label="Meus Ingressos" 
            to="/meus-ingressos" 
            isActive={isActive("/meus-ingressos")} 
          />
          
          <MenuItem 
            icon={<Gift className="h-5 w-5" />} 
            label="Recompensas" 
            to={ROUTES.ADMIN.LOYALTY} 
            isActive={isActive(ROUTES.ADMIN.LOYALTY)} 
          />
          
          <MenuItem 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label="Dashboard" 
            to={ROUTES.ADMIN.DASHBOARD} 
            isActive={isActive(ROUTES.ADMIN.DASHBOARD)} 
          />
          
          <MenuItem 
            icon={<Users className="h-5 w-5" />} 
            label="Usuários" 
            to={ROUTES.ADMIN.USERS} 
            isActive={isActive(ROUTES.ADMIN.USERS)} 
          />
          
          <MenuItem 
            icon={<Settings className="h-5 w-5" />} 
            label="Configurações" 
            to="/admin/configuracoes" 
            isActive={isActive("/admin/configuracoes")} 
          />
        </ul>
      </nav>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
}

function MenuItem({ icon, label, to, isActive }: MenuItemProps) {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
          isActive
            ? "bg-amber-50 text-amber-500"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </Link>
    </li>
  );
}
