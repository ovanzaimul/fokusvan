import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  resend,
  resetPassword,
  signInWithEmail,
  signUpNewUser,
} from "./authApi";

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
import { zodResolver } from "@hookform/resolvers/zod";

type FormState = "signUp" | "signIn" | "reset";

interface AuthFormProps {
  onSuccess: () => void;
}

// interface FormData {
//   email: string;
//   password: string;
//   displayName: string;
// }
type FormValues = z.infer<ReturnType<typeof createSchema>>;

function createSchema(formState: FormState) {
  return z.object({
    email: z.email("Please enter a valid email address"),
    password:
      formState !== "reset"
        ? z
            .string()
            .min(1, "Password is required")
            .min(6, "Password must be at least 6 characters")
        : z.string().optional(),
    displayName:
      formState == "signUp"
        ? z
            .string()
            .nonempty("Display name is required")
            .min(2, "Display name must be at least two characters")
            .max(10, "Display name must be 15 characters or less")
        : z.string().optional(),
  });
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
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { countDown, setStart } = useCountDown(TIME_IN_SECOND);

  const schema = createSchema(formState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function switchFormState(state: FormState) {
    setFormState(state);
    setError("");
    setShowPassword(false);
  }

  async function onSubmit(data: FormValues) {
    setLoading(true);
    const { displayName, email, password } = data;

    try {
      if (formState == "signIn") {
        const data = await signInWithEmail(email, password!);
        if (data) onSuccess();
      }
      if (formState == "signUp") {
        const data = await signUpNewUser(email, password!, displayName!);
        if (data) {
          setEmail(email);
          setEmailSent(true);
          setStart(true);
        }
      }
      if (formState == "reset") {
        await resetPassword(email);
        setEmail(email);
        setEmailSent(true);
        setStart(true);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const confirmationMessage = (
    <Card>
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          {formState == "signUp"
            ? `We sent a confirmation link to ${email}. Click it to activate your account`
            : `If an account exists for ${email}, we've sent a link to reset your
          password`}
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
              switchFormState("signIn");
              setEmailSent(false);
            }}
          >
            Back to sign in
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              setLoading(true);
              if (formState == "signUp") {
                await resend(email);
              } else {
                await resetPassword(email);
              }
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

  return emailSent ? (
    confirmationMessage
  ) : (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{FORMTEXT[formState].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              {...register("email")}
              autoComplete="email"
              required
            />
            {errors.email && (
              <p className="text-red-300">{errors.email.message}</p>
            )}
          </div>
          {formState == "signUp" && (
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                type="text"
                id="displayName"
                {...register("displayName")}
                required
              />
              {errors.displayName && (
                <p className="text-red-300">{errors.displayName.message}</p>
              )}
            </div>
          )}

          {(formState == "signUp" || formState == "signIn") && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                required
              />
              {errors.password && (
                <p className="text-red-300">{errors.password.message}</p>
              )}
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
          <p className="text-red-300">{error}</p>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        {formState == "signIn" && (
          <Button variant={"ghost"} onClick={() => switchFormState("reset")}>
            Forgot Password?
          </Button>
        )}
        {formState == "reset" && (
          <Button variant="ghost" onClick={() => switchFormState("signIn")}>
            Back to sign in
          </Button>
        )}
        {(formState == "signUp" || formState == "signIn") && (
          <Button
            variant="link"
            onClick={() => {
              switchFormState(formState == "signIn" ? "signUp" : "signIn");
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
