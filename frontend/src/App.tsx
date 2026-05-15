import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
    return <ProfileSetupPage onProfileSaved={() => setHasProfile(true)} />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<ApplicationsPage />} />
      <Route
        path="/profile"
        element={<ProfileSetupPage onProfileSaved={() => setHasProfile(true)} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;