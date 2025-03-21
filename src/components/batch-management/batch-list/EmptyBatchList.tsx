
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";

export const EmptyBatchList = () => {
  return (
    <CardContent className="flex justify-center py-6">
      <div className="text-center">
        <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="mb-4 text-muted-foreground">Este evento ainda não possui lotes de ingressos cadastrados.</p>
      </div>
    </CardContent>
  );
};
