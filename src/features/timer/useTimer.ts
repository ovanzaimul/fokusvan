import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusState } from "./Timer";

type TimerState = "idle" | "running" | "paused" | "finished";

const INTERVAL_DELAY_MS = 100;

function initTime(time: number) {
  const lsTime = localStorage.getItem("time");
  if (!lsTime) return time;
  if (JSON.parse(lsTime) > 0) {
    return JSON.parse(lsTime);
  }
  return 0;
}

function initTimeStamp() {
  const lsStamp = localStorage.getItem("timeStamp");
  if (!lsStamp) return 0;
  return JSON.parse(lsStamp);
}

function initTimerState() {
  const lsTime = localStorage.getItem("time");
  const state = localStorage.getItem("timerState");
  if (!state) return "idle";
  if (!lsTime || JSON.parse(lsTime) <= 0) return "idle";
  return state as TimerState;
}

interface UseTimerOptions {
  onComplete: () => void;
  focusState: FocusState;
  startTime: number;
}

export default function useTimer({
  onComplete,
  focusState,
  startTime,
}: UseTimerOptions) {
  const [timeInMs, setTimeInMs] = useState(() => initTime(startTime));
  const [timeStamp, setTimeStamp] = useState(initTimeStamp);
  const [timerState, setTimerState] = useState<TimerState>(initTimerState);

  const intervalIdRef = useRef<number>(null);

  function updateTime(time: number) {
    setTimeInMs(time);
    localStorage.setItem("time", JSON.stringify(time));
  }
  function updateTimeStamp(stamp: number) {
    setTimeStamp(stamp);
    localStorage.setItem("timeStamp", JSON.stringify(stamp));
  }
  function updateTimerState(state: TimerState) {
    setTimerState(state);
    localStorage.setItem("timerState", state);
  }

  const reset = useCallback((duration: number) => {
    updateTime(duration);
    updateTimerState("idle");
    updateTimeStamp(0);
  }, []);

  useEffect(() => {
    if (timerState == "running") {
      intervalIdRef.current = setInterval(() => {
        if (timeInMs > 0) {
          const now = Date.now();
          const interval = now - timeStamp;
          updateTimeStamp(now);
          if (timeInMs < 100) {
            updateTime(0);
          } else {
            updateTime(timeInMs - interval);
          }
        }
        if (timeInMs <= 0) {
          clearInterval(intervalIdRef.current!);
          setTimeInMs(0);
          setTimerState("finished");
          if (focusState == "focus") {
            onComplete();
          }
        }
      }, INTERVAL_DELAY_MS);
    }
    return () => clearInterval(intervalIdRef.current!);
  }, [timeInMs, timerState, timeStamp, onComplete, focusState]);

  function start() {
    const now = Date.now();
    updateTimeStamp(now);
    updateTimerState("running");
  }

  function pause() {
    updateTimerState("paused");
  }

  return { timeInMs, timerState, start, pause, reset };
}
