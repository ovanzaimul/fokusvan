import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useActivities } from "./ActivitiesContext";
import { ActivityDialog } from "./ActivityDialog";
import { ActivityForm } from "./ActivityForm";
import MergeActivitiesDialog from "./MergeActivitiesDialog";
import { Spinner } from "@/components/ui/spinner";
import Activity from "./Activity";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Activities() {
  const [openDialog, setOpenDialog] = useState(false);

  const { activities, loading, error } = useActivities();
  const sortedActivities = activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Card className="w-lg py-4">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>What are you focusing on?</CardTitle>
        <ActivityDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          title="Add Activity"
          trigger={
            <Button variant="outline" size="icon">
              <Plus />
            </Button>
          }
        >
          <ActivityForm type="add" onSuccess={() => setOpenDialog(false)} />
        </ActivityDialog>
      </CardHeader>
      <CardContent className="flex flex-col  gap-1">
        <CardDescription>Activities:</CardDescription>
        {error && <p className="text-red-300">{error}</p>}
        {loading && (
          <p className="flex justify-center items-center">
            <Spinner className="size-8" />
          </p>
        )}
        {!loading && !error && activities.length === 0 && (
          <p>No activities yet.</p>
        )}
        {sortedActivities.map((item) => (
          <Activity key={item.id} item={item} />
        ))}
      </CardContent>
      <MergeActivitiesDialog />
    </Card>
  );
}
