import useTimer from "./useTimer";

import { Button } from "../../components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "../../components/ui/toast";
import { useState } from "react";

interface TimerProps {
  activeActivityId: string | null;
  onCompleteFocus: () => void;
}
export type FocusState = "focus" | "rest" | "recovery";

const DURATIONS: Record<FocusState, number> = {
  focus: 30 * 60 * 1000,
  rest: 5 * 60 * 1000,
  recovery: 10 * 60 * 1000,
};

const tabLabels: Record<FocusState, string> = {
  focus: "Focus",
  rest: "Rest",
  recovery: "Recovery",
};

const focusStateLabels: FocusState[] = ["focus", "rest", "recovery"];

function initFocusState(): FocusState {
  const state = localStorage.getItem("focusState");
  if (state) return state as FocusState;
  return "focus";
}

export default function Timer({
  activeActivityId,
  onCompleteFocus,
}: TimerProps) {
  const [focusState, setFocusState] = useState<FocusState>(initFocusState);

  const { time, start, pause, reset, timerState } = useTimer({
    onComplete: onCompleteFocus,
    focusState,
  });

  const minutes = Math.floor(time / 1000 / 60);
  const seconds = Math.floor((time / 1000) % 60);

  function handleStart() {
    if (!activeActivityId) {
      toast.add({
        type: "info",
        title: "Choose an activity first",
        description: "Select one from your focus list.",
      });
      return;
    }
    start();
  }

  function handleReset() {
    reset(DURATIONS[focusState]);
  }

  function handleTabSwitch(tabValue: FocusState) {
    setFocusState(tabValue);
    localStorage.setItem("focusState", tabValue);
    reset(DURATIONS[tabValue]);
  }

  return (
    <Card className="w-lg py-4">
      <CardHeader className="flex justify-center">
        <Tabs value={focusState} onValueChange={handleTabSwitch}>
          <TabsList variant="line" className="gap-1">
            {focusStateLabels.map((item) => (
              <TabsTrigger key={item} value={item}>
                {tabLabels[item]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="text-7xl font-bold tabular-nums flex justify-center">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-1">
        {(timerState === "idle" || timerState === "paused") && (
          <Button onClick={handleStart}>
            {timerState == "paused" ? "Continue" : "Start"}
          </Button>
        )}
        {timerState === "running" && <Button onClick={pause}>Pause</Button>}
        <Button onClick={handleReset}>Reset</Button>
      </CardFooter>
    </Card>
  );
}
