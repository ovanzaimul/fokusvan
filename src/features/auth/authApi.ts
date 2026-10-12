import { supabase } from "@/lib/supabase";

export async function signUpNewUser(
  email: string,
  password: string,
  displayName: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
      emailRedirectTo: "http://localhost:5173/",
    },
  });
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
  console.log(data.session);
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) console.error(error);
}
