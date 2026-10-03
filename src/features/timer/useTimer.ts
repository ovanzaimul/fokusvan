import { useEffect, useRef, useState } from "react";
import type { FocusState } from "./Timer";

type TimerState = "idle" | "running" | "paused" | "finished";

const INTERVAL_DELAY_MS = 100;

function initTime() {
  const lsTime = localStorage.getItem("time");
  if (!lsTime) return 0;
  if (JSON.parse(lsTime) > 0) {
    return JSON.parse(lsTime);
  }
  return 0; //60 s in ms
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
}

export default function useTimer({ onComplete, focusState }: UseTimerOptions) {
  const [time, setTime] = useState(initTime);
  const [timeStamp, setTimeStamp] = useState(initTimeStamp);
  const [timerState, setTimerState] = useState<TimerState>(initTimerState);

  const intervalIdRef = useRef<number>(null);

  function updateTime(time: number) {
    setTime(time);
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

  useEffect(() => {
    if (timerState == "running") {
      intervalIdRef.current = setInterval(() => {
        if (time > 0) {
          const now = Date.now();
          const interval = now - timeStamp;
          updateTimeStamp(now);
          if (time < 100) {
            updateTime(0);
          } else {
            updateTime(time - interval);
          }
        }
        if (time <= 0) {
          clearInterval(intervalIdRef.current!);
          setTime(0);
          setTimerState("finished");
          if (focusState == "focus") {
            onComplete();
          }
        }
      }, INTERVAL_DELAY_MS);
    }
    return () => clearInterval(intervalIdRef.current!);
  }, [time, timerState, timeStamp, onComplete, focusState]);

  function start() {
    const now = Date.now();
    updateTimeStamp(now);
    updateTimerState("running");
  }

  function pause() {
    updateTimerState("paused");
  }

  function reset(duration: number) {
    updateTime(duration);
    updateTimerState("idle");
    updateTimeStamp(0);
  }

  return { time, timerState, start, pause, reset };
}
