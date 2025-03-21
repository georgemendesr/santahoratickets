
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { LogoHeader } from "@/components/layout/LogoHeader";

interface EventPageLayoutProps {
  title: string;
  description?: string;
  onBack: () => void;
  children: ReactNode;
}

export const EventPageLayout = ({
  title,
  description,
  onBack,
  children,
}: EventPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <LogoHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
