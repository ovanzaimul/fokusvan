import { useCallback } from "react";
import { useActivities } from "./features/activities/ActivitiesContext";
import Timer from "./features/timer/Timer";
import ActivityList from "./features/activities/Activites";
import AuthButton from "./features/auth";

function App() {
  const {
    activities,
    updateActiveActivityId,
    activeActivityId,
    setActivities,
  } = useActivities();

  const completeFocus = useCallback(() => {
    setActivities((prev) => {
      return prev.map((t) => {
        return t.id !== activeActivityId
          ? t
          : { ...t, completed: t.completed + 1 };
      });
    });
  }, [activeActivityId, setActivities]);

  return (
    <div className="dark min-h-screen flex items-center justify-center flex-col gap-5 bg-background p-4">
      <AuthButton />
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
