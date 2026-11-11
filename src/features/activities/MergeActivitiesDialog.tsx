import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  mergeLocalActivities,
  readLocalActivities,
} from "@/lib/local-activities";
import { useActivities } from "./ActivitiesContext";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function MergeActivitiesDialog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { openMergeDialog, setOpenMergeDialog, getActivities } =
    useActivities();
  const localActivities = readLocalActivities();

  async function handleMerge() {
    try {
      setLoading(true);
      await mergeLocalActivities();
      location.replace(location.href);
      setOpenMergeDialog(false);
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

  return (
    <Dialog
      open={openMergeDialog}
      onOpenChange={setOpenMergeDialog}
      disablePointerDismissal={true}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {`Save ${localActivities.length} local 
            ${localActivities.length > 1 ? "activities" : "activity"} to your
            account?`}
          </DialogTitle>
          <DialogDescription className="">
            <b>Add to my account:</b> Saved to your account
            <br />
            <b> Don't add:</b> Stays on this device only. Hidden while you're
            signed in, and shown again if you sign out.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Button type="button" onClick={handleMerge}>
            {loading ? <Spinner /> : "Add to my account"}
          </Button>
          <Button
            variant={"outline"}
            onClick={() => {
              localStorage.setItem("askToMerge", JSON.stringify(false));
              setOpenMergeDialog(false);
              getActivities();
            }}
          >
            Don't add
          </Button>
        </div>
        <p className="text-red-300">{error}</p>
      </DialogContent>
    </Dialog>
  );
}
