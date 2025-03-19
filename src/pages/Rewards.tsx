
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/components/layout/MainLayout";
import { RewardsContainer } from "@/components/rewards/RewardsContainer";
import { Gift } from "lucide-react";

const Rewards = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  if (!session) {
    navigate("/auth");
    return null;
  }

  return (
    <MainLayout>
      <RewardsContainer userId={session.user?.id} />
    </MainLayout>
  );
};

export default Rewards;
