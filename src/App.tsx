import Timer from "./features/timer/Timer";
import Activities from "./features/activities";
import Headers from "./components/Headers";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-5 bg-background p-4">
      <Headers />
      <Timer />
      <Activities />
    </div>
  );
}

export default App;
