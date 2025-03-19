
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { MainLayout } from "../layout/MainLayout";

interface CheckoutLayoutProps {
  children: React.ReactNode;
  onBackClick?: () => void;
}

export function CheckoutLayout({ children, onBackClick }: CheckoutLayoutProps) {
  const { goBack } = useNavigation();
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBackClick || goBack}
          className="mb-6 group hover:bg-white/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Voltar
        </Button>

        {children}
      </div>
    </MainLayout>
  );
}
