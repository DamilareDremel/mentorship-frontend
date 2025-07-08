import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "@remix-run/react";

type AuthContextType = {
  isLoggedIn: boolean;
  userName: string | null;
  userRole: string | null;
  isAuthReady: boolean;
  login: (token: string, name: string, role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole");

    if (token && storedName && storedRole) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/check-token`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.status === 200) {
            setIsLoggedIn(true);
            setUserName(storedName);
            setUserRole(storedRole);
          } else {
            console.log("Token expired — logging out.");
            logout();
            navigate("/login");
          }
        })
        .catch((err) => {
          console.error("Token check failed:", err);
          logout();
          navigate("/login");
        })
        .finally(() => {
          setIsAuthReady(true);
        });
    } else {
      setIsAuthReady(true);
    }
  }, []);

  const login = (token: string, name: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);
    document.cookie = `token=${token}; path=/`;
    setIsLoggedIn(true);
    setUserName(name);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserName(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userName, userRole, isAuthReady, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
