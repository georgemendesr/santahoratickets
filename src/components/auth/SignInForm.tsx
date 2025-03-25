
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";

export function SignInForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
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
  );
}
