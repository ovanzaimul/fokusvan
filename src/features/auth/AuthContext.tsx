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
    } = supabase.auth.onAuthStateChange((event, session) => {
      supabase.auth.getClaims().then(({ data }) => {
        setClaims(data?.claims || null);
      });
      if (event === "SIGNED_IN") {
        // Check your email to confirm your account(if no session)
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
