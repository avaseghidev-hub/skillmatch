import { useEffect, useState } from "react";
import { ApplicationsPage } from "./features/applications/pages/ApplicationsPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { useAuth } from "./features/auth/context/AuthContext";
import { ProfileSetupPage } from "./features/profile/pages/ProfileSetupPage";
import { getProfileByUserId } from "./features/profile/api/profileApi";

function App() {
  const { token, userId } = useAuth();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [hasProfile, setHasProfile] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  /**
   * Check if the logged-in user already has a profile.
   */
  useEffect(() => {
    if (!token || !userId) {
      setHasProfile(false);
      return;
    }

    const checkProfile = async () => {
      try {
        setIsCheckingProfile(true);

        await getProfileByUserId(userId);

        setHasProfile(true);
      } catch {
        setHasProfile(false);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [token, userId]);

  if (!token) {
    return authMode === "login" ? (
      <LoginPage onShowRegister={() => setAuthMode("register")} />
    ) : (
      <RegisterPage onShowLogin={() => setAuthMode("login")} />
    );
  }

  if (isCheckingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        Checking profile...
      </div>
    );
  }

  if (!hasProfile) {
    return <ProfileSetupPage onProfileCreated={() => setHasProfile(true)} />;
  }

  return <ApplicationsPage />;
}

export default App;