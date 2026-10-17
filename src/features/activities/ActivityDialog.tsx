import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface ActivityDialogProps {
  children: React.ReactNode;
  title: string;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ActivityDialog({
  children,
  open,
  onOpenChange,
  title,
}: ActivityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon">
            <Plus />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
