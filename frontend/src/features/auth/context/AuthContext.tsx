import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type AuthUser = {
  userId: number;
  name: string;
  email: string;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  userId: number | null;
  loginUser: (data: {
    token: string;
    userId: number;
    name: string;
    email: string;
  }) => void;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Read saved user data from localStorage.
 */
const getSavedUser = (): AuthUser | null => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as AuthUser;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<AuthUser | null>(() => getSavedUser());

  const userId = user?.userId ?? null;

  /**
   * Save authenticated user data after login or register.
   */
  const loginUser = (data: {
    token: string;
    userId: number;
    name: string;
    email: string;
  }) => {
    const authUser: AuthUser = {
      userId: data.userId,
      name: data.name,
      email: data.email,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(authUser));

    setToken(data.token);
    setUser(authUser);
  };

  /**
   * Clear authentication data and log the user out.
   */
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        userId,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Access authentication state from any component.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};