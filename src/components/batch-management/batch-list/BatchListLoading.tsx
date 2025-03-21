
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const BatchListLoading = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lotes cadastrados</CardTitle>
        <CardDescription>Carregando lotes...</CardDescription>
      </CardHeader>
    </Card>
  );
};
