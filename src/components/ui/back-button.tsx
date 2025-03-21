
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  destination?: string;
  className?: string;
}

export const BackButton = ({ destination = '/admin/eventos', className }: BackButtonProps) => {
  const handleGoBack = () => {
    // Solução simplificada: voltar para uma página específica e garantida
    window.location.href = destination;
  };
  
  return (
    <Button 
      onClick={handleGoBack} 
      variant="outline"
      className={className}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Voltar
    </Button>
  );
};
