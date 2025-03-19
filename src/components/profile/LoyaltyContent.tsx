
import { LoyaltyCard } from "@/components/event-details/LoyaltyCard";
import { LoyaltyFeatures } from "./LoyaltyFeatures";
import { PointsHistoryCard } from "./PointsHistoryCard";
import { LoyaltyActions } from "./LoyaltyActions";
import { UserProfile } from "@/types";
import { Session } from "@supabase/supabase-js";

interface LoyaltyContentProps {
  session: Session | null;
  profile: UserProfile | null;
}

export const LoyaltyContent = ({ session, profile }: LoyaltyContentProps) => {
  return (
    <div className="space-y-6">
      {profile && <LoyaltyCard points={profile.loyalty_points} />}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LoyaltyFeatures />
        
        <PointsHistoryCard userId={session?.user.id} />
      </div>
      
      <LoyaltyActions />
    </div>
  );
};
