import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user: any = localStorage.getItem("neouser");
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        console.log("in useCurrentUser", parsedUser);
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser, loading };
}
