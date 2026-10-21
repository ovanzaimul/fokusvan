import { useState } from "react";

import { resetPassword, signInWithEmail, signUpNewUser } from "./authApi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useCountDown } from "./useCountdown";

type FormState = "signUp" | "signIn" | "reset";

interface AuthFormProps {
  onSuccess: () => void;
}

const FORMTEXT: Record<FormState, { button: string; title: string }> = {
  signUp: { title: "Sign Up", button: "Create account" },
  signIn: { title: "Sign In", button: "Sign In" },
  reset: { title: "Reset Password", button: "Send reset link" },
};

const TIME_IN_SECOND = 60;

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [formState, setFormState] = useState<FormState>("signIn");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [email, setEmail] = useState("");

  const { countDown, setStart } = useCountDown(TIME_IN_SECOND);

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
    if (formState == "reset") {
      await resetPassword(email);
      setEmail(email);
      setResetSent(true);
      setStart(true);
    }

    setLoading(false);
  }

  const confirmationMessage = (
    <Card>
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          If an account exists for {email}, we've sent a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Didn't get it? Check your spam folder.</p>
        <p>The link expires in 1 hour</p>
      </CardContent>
      <CardFooter>
        <CardAction>
          <Button
            variant="link"
            onClick={() => {
              setFormState("signIn");
              setResetSent(false);
            }}
          >
            Back to sign in
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              setLoading(true);
              await resetPassword(email);
              setLoading(false);
            }}
            disabled={countDown > 0}
          >
            {countDown > 0 ? (
              `Resend in ${countDown}s`
            ) : loading ? (
              <Spinner />
            ) : (
              "Resend Email"
            )}
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );

  return resetSent ? (
    confirmationMessage
  ) : (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{FORMTEXT[formState].title}</CardTitle>
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

          {(formState == "signUp" || formState == "signIn") && (
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
          )}

          {formState == "reset" && <div></div>}
          <Button disabled={loading} type="submit">
            {loading ? <Spinner /> : FORMTEXT[formState].button}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        {formState == "signIn" && (
          <Button variant={"ghost"} onClick={() => setFormState("reset")}>
            Forgot Password?
          </Button>
        )}
        {formState == "reset" && (
          <Button variant="ghost" onClick={() => setFormState("signIn")}>
            Back to sign in
          </Button>
        )}
        {(formState == "signUp" || formState == "signIn") && (
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
        )}
      </CardFooter>
    </Card>
  );
}
