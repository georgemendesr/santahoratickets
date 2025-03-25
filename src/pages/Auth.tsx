
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { SignUpSuccess } from "@/components/auth/SignUpSuccess";
import { AuthError } from "@/components/auth/AuthError";

export default function Auth() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

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
