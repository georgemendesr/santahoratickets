
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { User, Settings, PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function MainHeader() {
  const { session, signOut, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/diagnostico");
      toast.info("Verificando suas permissões de administrador...");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                Início
              </Link>
            </NavigationMenuItem>

            {/* Evento pode ser criado por qualquer usuário logado */}
            {session && (
              <NavigationMenuItem>
                <Link to="/events/create" className={navigationMenuTriggerStyle()}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Criar Evento
                </Link>
              </NavigationMenuItem>
            )}

            {/* Link para administração - redireciona para diagnóstico se não for admin */}
            {session && (
              <NavigationMenuItem>
                <Button 
                  variant="ghost" 
                  className={navigationMenuTriggerStyle()} 
                  onClick={handleAdminClick}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Administração
                </Button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
              >
                Sair
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button>Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
