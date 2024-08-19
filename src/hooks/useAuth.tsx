import {
  useState,
  useEffect,
  useMemo,
  createContext,
  ReactNode,
  useContext,
} from "react";

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth as firebaseAuth, provider } from "../firebase"; // Firebase config

import {
  signIn,
  signOut as cognitoSignOut,
  signInWithRedirect,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth"; // Cognito config
import { useLocalStorage } from "./useLocalStorage";
import { toast } from "react-toastify";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loginWithCognito: (username: string, password: string) => Promise<void>;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useLocalStorage("neoUser", null);
  const [loading, setLoading] = useState(true);
  const authMode = import.meta.env.MODE; // Determine the mode

  function parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  const signInWithGoogle = async () => {
    try {
      if (authMode === "firebase") {
        const result: any = await signInWithPopup(firebaseAuth, provider);
        setUser(result.user);
      }
      if (authMode === "cognito") {
        await signInWithRedirect({ provider: "Google" });
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      toast.error("Error signing in with Google.");
    }
  };

  const signOutUser = async () => {
    try {
      if (authMode === "firebase") {
        await firebaseSignOut(firebaseAuth);
      }
      if (authMode === "cognito") {
        await cognitoSignOut();
      }
      setUser(null);
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Error signing out.");
    }
  };

  const loginWithCognito = async (username: string, password: string) => {
    try {
      if (authMode === "cognito") {
        await signIn({ username, password });
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const tokens: any = session?.tokens || {};
        const idToken = tokens.idToken?.toString();
        const userEmail = tokens.signInDetails?.loginId?.toString();

        const token = parseJwt(idToken);

        localStorage.setItem(
          "neoUser",
          JSON.stringify({
            ...currentUser,
            idToken,
            userEmail,
            ...token,
          })
        );
        setUser({
          ...currentUser,
          idToken,
          userEmail,
          ...token,
        });
      }
    } catch (error) {
      toast.error("Error logging in with Cognito.");
    }
  };

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      if (authMode === "firebase") {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
      }
      if (authMode === "cognito") {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching current user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogle,
      signOutUser,
      loginWithCognito,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
