import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useActivities } from "./ActivitiesContext";
import { ActivityDialog } from "./ActivityDialog";
import { ActivityForm } from "./ActivityForm";
import MergeActivitiesDialog from "./MergeActivitiesDialog";
import { Spinner } from "@/components/ui/spinner";

export default function Activities() {
  const [openDialog, setOpenDialog] = useState(false);

  const {
    activities,
    updateActiveActivityId,
    activeActivityId,
    loading,
    error,
  } = useActivities();

  return (
    <Card className="w-lg py-4">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>What are you focusing on?</CardTitle>
        <ActivityDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          title="Add Activity"
        >
          <ActivityForm onSuccess={() => setOpenDialog(false)} />
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
          <p>No acitivities yet.</p>
        )}
        {activities.map((item) => {
          return (
            <Button
              variant="ghost"
              key={item.id}
              className="flex justify-between"
              onClick={() => updateActiveActivityId(item.id)}
            >
              <p>{item.title}</p>
              {activeActivityId === item.id && <span>Active</span>}
              <Badge>
                {item.completed}/{item.estimation}
              </Badge>
            </Button>
          );
        })}
      </CardContent>
      <MergeActivitiesDialog />
    </Card>
  );
}
