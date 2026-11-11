import { useCallback } from "react";
import Timer from "./features/timer/Timer";
import Activities, { useActivities } from "./features/activities";
import Headers from "./components/Headers";

function App() {
  const { activeActivityId, setActivities } = useActivities();

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
      <Headers />
      <Timer
        activeActivityId={activeActivityId}
        onCompleteFocus={completeFocus}
      />
      <Activities />
    </div>
  );
}

export default App;
