import Timer from "./features/timer/Timer";
import Activities, { useActivities } from "./features/activities";
import Headers from "./components/Headers";

function App() {
  const { activeActivityId } = useActivities();

  return (
    <div className="dark min-h-screen flex items-center justify-center flex-col gap-5 bg-background p-4">
      <Headers />
      <Timer activeActivityId={activeActivityId} />
      <Activities />
    </div>
  );
}

export default App;
