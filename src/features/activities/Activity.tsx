import { Button } from "@/components/ui/button";
import { useActivities, type Activity } from "./ActivitiesContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, PenLine, Trash } from "lucide-react";
import { useState } from "react";
import { ActivityDialog } from "./ActivityDialog";
import { ActivityForm } from "./ActivityForm";
import { toast } from "@/components/ui/toast";

interface ActivityProps {
  item: Activity;
}

export default function Activity({ item }: ActivityProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const {
    updateActiveActivityId,
    activeActivityId,
    removeActivity,
    setActivities,
  } = useActivities();

  async function handleDelete(id: string) {
    const timeout = 6000;
    const timeoutId = setTimeout(async () => {
      try {
        await removeActivity(id);
      } catch (err) {
        restore();
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        toast.add({
          title: `Couldn't delete "${item.title}". It's been restored.`,
          description: message,
        });
      }
    }, timeout);
    // Remove from the state(ui)
    setActivities((activities) =>
      activities.filter((activity) => activity.id !== item.id),
    );

    function restore() {
      if (timeoutId) clearTimeout(timeoutId);
      setActivities((activities) => [...activities, item]);
    }

    const toastId = toast.add({
      title: `Deleted '${item.title}'`,
      description: "This will be permanently removed shortly.",
      timeout,
      actionProps: {
        children: "Undo",
        onClick() {
          restore();
          toast.close(toastId);
          toast.add({
            title: `Restored '${item.title}'`,
            timeout: 2000,
          });
        },
      },
    });
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        key={item.id}
        className="flex-1 justify-between"
        onClick={() => updateActiveActivityId(item.id)}
      >
        <p>{item.title}</p>
        {activeActivityId === item.id && <span>Active</span>}
        <Badge>
          {item.completed}/{item.estimation}
        </Badge>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenDialog(true)}>
            <PenLine />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => handleDelete(item.id)}
          >
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ActivityDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Edit Activity"
      >
        <ActivityForm
          type="edit"
          onSuccess={() => setOpenDialog(false)}
          onCancel={() => setOpenDialog(false)}
          activity={item}
        />
      </ActivityDialog>
    </div>
  );
}
