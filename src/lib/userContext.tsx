import { account } from "@/configs/appwrite/clientConfig";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "./types";

type UserContextType = {
  user: User | null;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = useRouterState().location.pathname;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await account.get();

        // Redirect if not logged in but trying to access dashboard or checkout
        if (!data.$id && (path.includes("/dashboard") || path === "/checkout")) {
          router.navigate({ to: `/auth?redirect=${path}` });
          return;
        }

        // Redirect if logged in but on auth page
        if (path === "/auth" && data.$id) {
          router.navigate({ to: "/dashboard" });
          return;
        }

        // Fetch session token
        const session = await account.getSession("current");

        // If user has no image, load OAuth profile
        if (!data.prefs.image) {
          const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${session.providerAccessToken}`,
              },
            }
          );

          const profile = await res.json();
          await account.updatePrefs({ image: profile.picture });
        }

        if (isMounted) {
          setUser({ ...data, image: data.prefs.image });
          setIsLoading(false);
        }
      } catch {
        if (path !== "/auth" && path !== "/" && path !== "/demo" && !path.startsWith('/share/')) {
          router.navigate({ to: `/auth?redirect=${path}` });
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [path, router]);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
