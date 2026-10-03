import { useCallback, useState } from "react";
import Timer from "./features/timer/Timer";
import ActivityList from "./features/activity-list/ActivityList";

const activityList = [
  {
    id: "1",
    title: "Working on fokusvan project",
    estimation: 4,
    completed: 0,
    focusMinues: 60,
    done: false,
  },

  {
    id: "3",
    title: "Learn Backend(GO)",
    estimation: 4,
    completed: 0,
    focusMinues: 60,
    done: false,
  },
];

export interface ActivityList {
  id: string;
  title: string;
  estimation: number;
  completed: number;
  focusMinues: number;
  done: boolean;
}

function initActivityId() {
  const activityId = localStorage.getItem("activityId");
  return activityId;
}

function App() {
  const [activities, setActivities] = useState<ActivityList[]>(activityList);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(
    initActivityId,
  );
  function updateActiveActivityId(id: string) {
    localStorage.setItem("activityId", id);
    setActiveActivityId(id);
  }
  const completeFocus = useCallback(() => {
    setActivities((prev) => {
      return prev.map((t) => {
        return t.id !== activeActivityId
          ? t
          : { ...t, completed: t.completed + 1 };
      });
    });
  }, [activeActivityId]);

  return (
    <div className="dark min-h-screen flex items-center justify-center flex-col gap-5 bg-background p-4">
      <Timer
        activeActivityId={activeActivityId}
        onCompleteFocus={completeFocus}
      />
      <ActivityList
        activityList={activities}
        activeActivityId={activeActivityId}
        updateActiveActivityId={updateActiveActivityId}
      />
    </div>
  );
}

export default App;
