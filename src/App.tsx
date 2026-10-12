import { useCallback } from "react";
import { useActivities } from "./features/activities/ActivitiesContext";
import Timer from "./features/timer/Timer";
import AuthButton from "./features/auth";
import Activities from "./features/activities/Activites";

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

      <Activities
        activities={activities}
        activeActivityId={activeActivityId}
        updateActiveActivityId={updateActiveActivityId}
      />
    </div>
  );
}

export default App;
