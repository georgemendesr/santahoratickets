
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus, Mail, CheckCircle2 } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (session) {
    navigate("/");
    return null;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log("Tentando fazer login com:", { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro de login:", error);
        throw error;
      }

      console.log("Login bem-sucedido:", data);
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error("Erro completo:", error);
      let mensagem = "Erro ao fazer login";
      
      if (error.message) {
        if (error.message.includes("Invalid login")) {
          mensagem = "Email ou senha incorretos";
        } else if (error.message.includes("Email not confirmed")) {
          mensagem = "Por favor, confirme seu email para fazer login";
        } else {
          mensagem += ": " + error.message;
        }
      }
      
      setError(mensagem);
      toast.error(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log("Tentando criar conta com:", { email });
      
      // Verificar se o domínio de email é válido
      // Removido para permitir qualquer domínio de email
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            email: email,
          }
        }
      });

      if (error) {
        console.error("Erro ao criar conta:", error);
        throw error;
      }

      console.log("Resposta de criação de conta:", data);
      
      if (data.user?.identities?.length === 0) {
        throw new Error("Este email já está cadastrado");
      }
      
      setSignUpSuccess(true);
      e.currentTarget.reset();
      
    } catch (error: any) {
      console.error("Erro completo ao criar conta:", error);
      let mensagem = "Erro ao criar conta";
      
      if (error.message) {
        if (error.message.includes("User already registered")) {
          mensagem = "Este email já está cadastrado";
        } else if (error.message.includes("Este email já está cadastrado")) {
          mensagem = error.message;
        } else {
          mensagem += ": " + error.message;
        }
      }
      
      setError(mensagem);
      toast.error(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Bem-vindo ao Santa Hora!</CardTitle>
          <CardDescription>
            Faça login ou crie uma conta para comprar suas pulseiras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Digite seu email"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              {signUpSuccess ? (
                <div className="text-center space-y-4 py-8">
                  <div className="flex justify-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-600">Conta criada com sucesso!</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Enviamos um email de confirmação para você.
                    </p>
                    <div className="flex justify-center items-center text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>Verifique sua caixa de entrada</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSignUpSuccess(false)}
                  >
                    Criar outra conta
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Digite seu email"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Digite sua senha (mínimo 6 caracteres)"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {isLoading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            Ao criar uma conta, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
