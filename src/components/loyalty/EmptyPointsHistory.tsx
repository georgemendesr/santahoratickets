
import { Info } from "lucide-react";
import { CardContent } from "@/components/ui/card";

export const EmptyPointsHistory = () => {
  return (
    <CardContent className="flex flex-col items-center justify-center py-10">
      <div className="rounded-full bg-purple-100 p-3 mb-4">
        <Info className="h-6 w-6 text-purple-500" />
      </div>
      <p className="text-muted-foreground text-center">
        Você ainda não possui histórico de pontos.
      </p>
      <p className="text-sm text-muted-foreground text-center mt-2">
        Compre ingressos ou receba indicações para acumular pontos!
      </p>
    </CardContent>
  );
};
