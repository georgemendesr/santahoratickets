
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { SignUpSuccess } from "@/components/auth/SignUpSuccess";
import { AuthError } from "@/components/auth/AuthError";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { session, loading, resetAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [authCheckTimeout, setAuthCheckTimeout] = useState(false);

  // Set timeout for loading check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        setAuthCheckTimeout(true);
      }
    }, 8000); // 8 seconds

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Redirect if authenticated
  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
          
          {authCheckTimeout && (
            <div className="mt-6">
              <p className="text-red-500 mb-2">Está demorando mais do que o esperado.</p>
              <Button 
                variant="outline" 
                onClick={resetAuth}
                className="mt-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reiniciar autenticação
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (session) {
    navigate("/");
    return null;
  }

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

            <AuthError message={error} />

            <TabsContent value="login">
              <SignInForm />
            </TabsContent>

            <TabsContent value="signup">
              {signUpSuccess ? (
                <SignUpSuccess onReset={() => setSignUpSuccess(false)} />
              ) : (
                <SignUpForm onSuccess={() => setSignUpSuccess(true)} />
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
