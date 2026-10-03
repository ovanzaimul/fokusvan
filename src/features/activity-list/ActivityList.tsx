import { Plus } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

import type { ActivityList } from "../../App";

interface ActivityListProps {
  activityList: ActivityList[];
  activeActivityId: string | null;
  updateActiveActivityId: (id: string) => void;
}

export default function ActivityList({
  activityList,
  activeActivityId,
  updateActiveActivityId,
}: ActivityListProps) {
  return (
    <Card className="w-lg py-4">
      <CardHeader className="flex items-center">
        <CardTitle>What are you focusing on?</CardTitle>
        <Button variant="outline" size="icon">
          <Plus />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {activityList.map((item) => {
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
    </Card>
  );
}
