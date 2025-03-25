
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Mail, CheckCircle2 } from "lucide-react";

interface SignUpFormProps {
  onSuccess: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log("Tentando criar conta com:", { email });
      
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
      
      onSuccess();
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
  );
}
