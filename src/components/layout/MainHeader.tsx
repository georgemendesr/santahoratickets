
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Ticket, LayoutTemplate, Users, User, PlusCircle, Settings, CalendarDays } from "lucide-react";
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
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Início
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Evento pode ser criado por qualquer usuário logado */}
            {session && (
              <NavigationMenuItem>
                <Link to="/events/create">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Criar Evento
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}

            {/* Links administrativos - visíveis apenas para administradores */}
            {isAdmin && (
              <>
                <NavigationMenuItem>
                  <Link to="/admin">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/admin/eventos">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Eventos
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
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
