import { Button } from "@/components/ui/button";
import { useActivities, type Activity } from "./ActivitiesContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, Ellipsis, PenLine, Trash, Undo2 } from "lucide-react";
import { useState } from "react";
import { ActivityDialog } from "./ActivityDialog";
import { ActivityForm } from "./ActivityForm";
import { toast } from "@/components/ui/toast";
import { useAuth } from "../auth";

interface ActivityProps {
  item: Activity;
  type: "active" | "archived";
}

export default function Activity({ item, type }: ActivityProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const { claims } = useAuth();
  const userId = claims?.sub;
  const completed = userId ? item.focusSessions?.length : item.completed;

  const {
    updateActiveActivityId,
    activeActivityId,
    removeActivity,
    saveActivity,
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

  async function handleArchive(id: string, item: Activity) {
    const now = new Date().toISOString();
    try {
      await saveActivity(id, {
        ...item,
        archivedAt: type == "active" ? now : null,
      });
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      toast.add({
        title: `Couldn't ${type == "active" ? "archive" : "unarchive"} "${item.title}".`,
        description: message,
      });
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        key={item.id}
        className="flex-1 justify-between"
        onClick={() => type == "active" && updateActiveActivityId(item.id)}
      >
        <p>{item.title}</p>
        {activeActivityId === item.id && <span>Active</span>}
        <Badge>
          {completed}/{item.estimation}
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

          <DropdownMenuItem
            variant="default"
            className="text-primary"
            onClick={() => handleArchive(item.id, item)}
          >
            {type == "active" ? <Archive /> : <Undo2 />}
            {type == "active" ? "Archived" : "Unarchive"}
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
