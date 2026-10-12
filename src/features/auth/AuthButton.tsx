import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AuthForm } from "./AuthForm";

import { useAuth } from "./AuthContext";
import { signOut } from "./authApi";

export default function AuthButton() {
  const [openDialog, setOpenDialog] = useState(false);

  const { claims } = useAuth();
  const username = claims?.user_metadata?.display_name;
  return (
    <div>
      {!claims && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger
            render={
              <Button variant="link" onClick={() => setOpenDialog(true)}>
                Sign In to save your progress
              </Button>
            }
          />
          <DialogContent>
            <AuthForm onSuccess={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>
      )}
      {claims && (
        <div className="flex justify-between items-center">
          <h2 className="text-emerald-100">Welcome, {username}</h2>

          <Button variant={"link"} onClick={signOut}>
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
}
