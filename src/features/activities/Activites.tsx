import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  useActivities,
  type Activity as ActivityType,
} from "./ActivitiesContext";
import { ActivityDialog } from "./ActivityDialog";
import { ActivityForm } from "./ActivityForm";
import MergeActivitiesDialog from "./MergeActivitiesDialog";
import { Spinner } from "@/components/ui/spinner";
import Activity from "./Activity";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Activities() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { activities, loading, error } = useActivities();
  const sortedActivities = activities
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .filter((activity) => activity.archivedAt === null);
  const archived = activities.filter(
    (activity) => activity.archivedAt !== null,
  );
  function renderContent(data: ActivityType[], type: "active" | "archived") {
    if (error) return <p className="text-red-300">{error}</p>;
    if (loading)
      return (
        <p className="flex justify-center items-center">
          <Spinner className="size-8" />
        </p>
      );
    if (data.length === 0)
      return (
        <p className="text-ring">{`No ${type === "archived" ? "archived" : ""} activities yet.`}</p>
      );

    return data.map((item) => (
      <Activity key={item.id} item={item} type={type} />
    ));
  }

  return (
    <Card className="w-full md:w-md max-w-lg">
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
          <ActivityForm
            type="add"
            onSuccess={() => setOpenDialog(false)}
            onCancel={() => setOpenDialog(false)}
          />
        </ActivityDialog>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <CardDescription>Activities:</CardDescription>
        {renderContent(sortedActivities, "active")}
        <Separator />
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardDescription>
            <CollapsibleTrigger
              render={
                <Button variant="link" className="p-0 hover:no-underline">
                  Archived({archived.length}):
                </Button>
              }
            />
          </CardDescription>
          <CollapsibleContent>
            {renderContent(archived, "archived")}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <MergeActivitiesDialog />
    </Card>
  );
}
