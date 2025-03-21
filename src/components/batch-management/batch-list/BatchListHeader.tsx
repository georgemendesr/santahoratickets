
import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";

interface BatchListHeaderProps {
  title: string;
  description?: string;
  isEmpty?: boolean;
}

export const BatchListHeader = ({ 
  title, 
  description = "Gerenciamento de lotes para este evento", 
  isEmpty = false 
}: BatchListHeaderProps) => {
  if (isEmpty) {
    return (
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Nenhum lote encontrado para este evento.</CardDescription>
      </CardHeader>
    );
  }

  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};
