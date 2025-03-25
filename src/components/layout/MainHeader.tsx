
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { User, Settings, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function MainHeader() {
  const { session, signOut } = useAuth();
  const { isAdmin } = useRole(session);

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

            {/* Link único para administração */}
            {isAdmin && (
              <NavigationMenuItem>
                <Link to="/admin" className={navigationMenuTriggerStyle()}>
                  <Settings className="h-4 w-4 mr-2" />
                  Administração
                </Link>
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
