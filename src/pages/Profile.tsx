
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

const Profile = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  if (!session) {
    navigate("/auth");
    return null;
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <ProfileHeader />
        <ProfileTabs />
      </div>
    </MainLayout>
  );
};

export default Profile;
