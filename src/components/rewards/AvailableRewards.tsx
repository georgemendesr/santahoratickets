
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Star } from "lucide-react";
import { UserProfile, Reward } from "@/types";
import { toast } from "sonner";

interface AvailableRewardsProps {
  rewards: Reward[];
  profile?: UserProfile | null;
  loading: boolean;
  onRedeem: (reward: Reward) => Promise<void>;
}

export const AvailableRewards = ({ rewards, profile, loading, onRedeem }: AvailableRewardsProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando recompensas...</p>
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-purple-100 p-3 mb-4">
            <Gift className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-muted-foreground text-center max-w-md">
            Ainda não há recompensas disponíveis. Continue acumulando pontos!
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleRedeemClick = async (reward: Reward) => {
    try {
      await onRedeem(reward);
    } catch (error) {
      console.error("Erro ao resgatar recompensa:", error);
      toast.error("Erro ao resgatar recompensa");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {rewards.map((reward) => {
        const canRedeem = profile?.loyalty_points >= reward.points_required;
        
        return (
          <Card key={reward.id} className={`overflow-hidden transition-all ${canRedeem ? 'border-purple-200 hover:shadow-md' : 'opacity-75'}`}>
            {reward.image && (
              <div className="relative h-40 bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                <img 
                  src={reward.image} 
                  alt={reward.title} 
                  className="h-full w-full object-cover"
                />
                {!canRedeem && (
                  <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {reward.title}
              </CardTitle>
              <CardDescription>
                {reward.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-md">
                <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                <span className="font-medium">{reward.points_required} pontos necessários</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!canRedeem}
                variant={canRedeem ? "default" : "outline"}
                onClick={() => canRedeem && handleRedeemClick(reward)}
              >
                {canRedeem ? (
                  "Resgatar Recompensa"
                ) : (
                  `Faltam ${reward.points_required - (profile?.loyalty_points || 0)} pontos`
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
