import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import type { Activity } from "./ActivitiesContext";
import { ActivityDialog } from "./ActivityDialog";
import { ActivityForm } from "./ActivityForm";
import MergeActivitiesDialog from "./MergeActivitiesDialog";

interface ActiviesProps {
  activities: Activity[];
  activeActivityId: string | null;
  updateActiveActivityId: (id: string) => void;
}

export default function Activities({
  activities,
  activeActivityId,
  updateActiveActivityId,
}: ActiviesProps) {
  const [openDialog, setOpenDialog] = useState(false);

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
      <CardContent className="flex flex-col gap-1">
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
