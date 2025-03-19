
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";

export const ProfileHeader = () => {
  const { goBack } = useNavigation();
  
  return (
    <Button
      variant="ghost"
      onClick={goBack}
      className="mb-4 group hover:bg-white/50"
    >
      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
      Voltar
    </Button>
  );
};
