
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";

interface SignUpSuccessProps {
  onReset: () => void;
}

export function SignUpSuccess({ onReset }: SignUpSuccessProps) {
  return (
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
        onClick={onReset}
      >
        Criar outra conta
      </Button>
    </div>
  );
}
