
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/components/layout/MainLayout";
import { RewardsContainer } from "@/components/rewards/RewardsContainer";
import { useEffect } from "react";

const Rewards = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return (
    <MainLayout>
      <RewardsContainer userId={session.user?.id} />
    </MainLayout>
  );
};

export default Rewards;
