
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AvailableRewards } from "./AvailableRewards";
import { MyRedemptions } from "./MyRedemptions";
import { RewardsHeader } from "./RewardsHeader";
import { useProfile } from "@/hooks/useProfile";
import { useRewards } from "@/hooks/useRewards";
import { Reward } from "@/types";
import { toast } from "sonner";

interface RewardsContainerProps {
  userId?: string;
}

export const RewardsContainer = ({ userId }: RewardsContainerProps) => {
  const { profile } = useProfile(userId);
  const { 
    myRedemptions, 
    loadingRewards, 
    loadingRedemptions, 
    getAvailableRewards, 
    getMyRedemptions, 
    redeemReward 
  } = useRewards(userId, profile);
  
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!userId) return;
      
      try {
        const rewardsData = await getAvailableRewards();
        setRewards(rewardsData);
      } catch (error) {
        console.error("Erro ao carregar recompensas:", error);
        toast.error("Erro ao carregar recompensas");
      }
    };

    const fetchRedemptions = async () => {
      if (!userId) return;
      
      try {
        await getMyRedemptions();
      } catch (error) {
        console.error("Erro ao carregar resgates:", error);
        toast.error("Erro ao carregar seus resgates");
      }
    };

    fetchRewards();
    fetchRedemptions();
  }, [userId, getAvailableRewards, getMyRedemptions]);

  const handleRedeemReward = async (reward: Reward) => {
    if (!profile || profile.loyalty_points < reward.points_required) {
      toast.error("Pontos insuficientes para este resgate");
      return;
    }

    try {
      const result = await redeemReward(reward.id, reward.points_required);
      if (result) {
        toast.success("Recompensa resgatada com sucesso!");
        // Atualizar lista de resgates
        await getMyRedemptions();
      }
    } catch (error) {
      console.error("Erro ao resgatar recompensa:", error);
      toast.error("Erro ao resgatar recompensa");
    }
  };

  const switchToRewardsTab = () => {
    document.querySelector('button[value="rewards"]')?.dispatchEvent(
      new Event('click', { bubbles: true })
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <RewardsHeader profile={profile} />

      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          <TabsTrigger value="my-redemptions">Meus Resgates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rewards">
          <AvailableRewards 
            rewards={rewards} 
            profile={profile} 
            loading={loadingRewards} 
            onRedeem={handleRedeemReward} 
          />
        </TabsContent>
        
        <TabsContent value="my-redemptions">
          <MyRedemptions 
            redemptions={myRedemptions} 
            loading={loadingRedemptions} 
            onSwitchToRewards={switchToRewardsTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
