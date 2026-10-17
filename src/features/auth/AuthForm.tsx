import { useState } from "react";

import { signInWithEmail, signUpNewUser } from "./authApi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

type FormState = "signUp" | "signIn";

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [formState, setFormState] = useState<FormState>("signIn");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const displayName = formData.get("displayName") as string;

    if (formState == "signIn") {
      const data = await signInWithEmail(email, password);
      if (data) onSuccess();
    }
    if (formState == "signUp") {
      const data = await signUpNewUser(email, password, displayName);
      if (data) onSuccess();
    }

    setLoading(false);
  }

  const buttonText = formState == "signIn" ? "Sign In" : "Create account";
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{formState == "signIn" ? "Sign In" : "Sign Up"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
            />
          </div>
          {formState == "signUp" && (
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input type="text" name="displayName" id="displayName" required />
            </div>
          )}

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              required
            />
            <div className="flex items-center">
              <Checkbox
                checked={showPassword}
                onCheckedChange={setShowPassword}
                id="show-password"
              />
              <Label htmlFor="show-password">Show Password</Label>
            </div>
          </div>
          <Button disabled={loading} type="submit">
            {loading ? <Spinner /> : buttonText}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          onClick={() => {
            setFormState((prev) => (prev == "signIn" ? "signUp" : "signIn"));
          }}
        >
          {formState == "signIn"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </Button>
      </CardFooter>
    </Card>
  );
}
