
import { Loader2 } from "lucide-react";

interface EventLoadingStateProps {
  message?: string;
}

export const EventLoadingState = ({ message = "Carregando..." }: EventLoadingStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium text-center">{message}</p>
      </div>
    </div>
  );
};
