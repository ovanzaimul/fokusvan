import { useEffect, useMemo, useState } from "react";

import useTimer from "./useTimer";
import { useSettings } from "../settings";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "../../components/ui/toast";
import { useActivities } from "../activities";

interface TimerProps {
  activeActivityId: string | null;
}
export type FocusState = "focus" | "rest" | "recovery";

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

export default function Timer({ activeActivityId }: TimerProps) {
  const [focusState, setFocusState] = useState<FocusState>(initFocusState);

  const { settings } = useSettings();
  const DURATIONSMS: Record<FocusState, number> = useMemo(
    () => ({
      focus: settings.focusMinutes * 60 * 1000,
      rest: settings.restMinutes * 60 * 1000,
      recovery: settings.recoveryMinutes * 60 * 1000,
    }),
    [settings.focusMinutes, settings.restMinutes, settings.recoveryMinutes],
  );

  const { completeFocusActivity } = useActivities();
  const { timeInMs, start, pause, reset, timerState } = useTimer({
    onComplete: handleCompleteFocus,
    focusState,
    startTime: DURATIONSMS[focusState],
  });

  const minutes = Math.floor(timeInMs / 1000 / 60);
  const seconds = Math.floor((timeInMs / 1000) % 60);

  async function handleCompleteFocus() {
    try {
      await completeFocusActivity(settings.focusMinutes);
    } catch (err) {
      console.error(err);
      toast.add({
        type: "error",
        title: "Something went wrong. Couldn't save your focus session",
        timeout: 10000,
      });
    }
  }

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
    reset(DURATIONSMS[focusState]);
  }

  function handleTabSwitch(tabValue: FocusState) {
    setFocusState(tabValue);
    localStorage.setItem("focusState", tabValue);
    reset(DURATIONSMS[tabValue]);
  }

  useEffect(() => {
    if (timerState === "idle") {
      reset(DURATIONSMS[focusState]);
    }
  }, [timerState, reset, focusState, DURATIONSMS]);

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
