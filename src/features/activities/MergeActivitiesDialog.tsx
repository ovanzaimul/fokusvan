import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  const { openMergeDialog, setOpenMergeDialog } = useActivities();
  const localActivities = readLocalActivities();

  async function handleMerge() {
    setLoading(true);
    await mergeLocalActivities();
    setOpenMergeDialog(false);
    setLoading(false);
  }

  return (
    <Dialog open={openMergeDialog} onOpenChange={setOpenMergeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add your {localActivities.length} local activities to your account?
          </DialogTitle>
        </DialogHeader>

        <div>
          <Button type="button" onClick={handleMerge}>
            {loading ? <Spinner /> : "Merge"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
