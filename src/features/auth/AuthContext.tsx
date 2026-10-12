import { supabase } from "@/lib/supabase";
import type { JwtPayload } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  claims: JwtPayload | null;
}

const Context = createContext<AuthContextType | null>(null);

export function AuthContext({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<JwtPayload | null>(null);

  useEffect(() => {
    supabase.auth.getClaims().then(({ data }) => {
      setClaims(data?.claims || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      supabase.auth.getClaims().then(({ data }) => {
        setClaims(data?.claims || null);
      });

      if (event === "INITIAL_SESSION") {
        // handle initial session
      } else if (event === "SIGNED_IN") {
        // handle sign in event
        console.log("user signIn");
      } else if (event === "SIGNED_OUT") {
        // handle sign out event
        console.log("user signOut");
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
      } else if (event === "USER_UPDATED") {
        // handle user updated event
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <Context value={{ claims }}>{children}</Context>;
}

export function useAuth() {
  const auth = useContext(Context);

  if (!auth) throw new Error("useAuth has to be used within the <AuthContext>");
  return auth;
}
