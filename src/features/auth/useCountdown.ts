import { useEffect, useRef, useState } from "react";

export function useCountDown(timeInSecond: number) {
  const [start, setStart] = useState(false);
  const [countDown, setCountDown] = useState(timeInSecond);
  const intervalIdRef = useRef<number>(null);

  useEffect(() => {
    if (start) {
      intervalIdRef.current = setInterval(() => {
        setCountDown(countDown - 1);
      }, 1000);
    }

    return () => clearInterval(intervalIdRef.current!);
  }, [start, countDown]);

  return { start, setStart, countDown };
}
