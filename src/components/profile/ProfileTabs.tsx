
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileContent } from "./ProfileContent";
import { LoyaltyContent } from "./LoyaltyContent";
import { useAuth } from "@/hooks/useAuth";
import { useProfileComposite } from "@/hooks/useProfileComposite";

export const ProfileTabs = () => {
  const { session } = useAuth();
  const { profile } = useProfileComposite(session?.user?.id);

  return (
    <Tabs defaultValue="profile" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
        <TabsTrigger value="loyalty">Fidelidade</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileContent session={session} profile={profile} />
      </TabsContent>
      
      <TabsContent value="loyalty">
        <LoyaltyContent session={session} profile={profile} />
      </TabsContent>
    </Tabs>
  );
};
