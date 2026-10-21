import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/features/auth";
import { signOut, updateUser } from "@/features/auth/authApi";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { claims } = useAuth();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newPassword = formData.get("new-password") as string;
    setLoading(true);
    await updateUser(newPassword);
    setLoading(false);
    toast.add({
      type: "success",
      description: "Password updated",
    });
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-lg">
        <CardHeader>
          <CardTitle>Choose a new password for {claims?.email}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <Field>
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <Input
                id="new-password"
                name="new-password"
                type={showPassword ? "text" : "password"}
                required
              />
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="show-password"
                checked={showPassword}
                onCheckedChange={setShowPassword}
              />
              <FieldLabel htmlFor="show-password">Show Password</FieldLabel>
            </Field>

            <Field orientation="horizontal">
              <Button type="submit">
                {loading ? <Spinner /> : "Update Password"}
              </Button>
              <Button
                variant="link"
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                Back to app
              </Button>
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
