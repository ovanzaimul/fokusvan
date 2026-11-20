import type { FocusState } from "@/features/timer/Timer";
import bell2 from "/sounds/481060__lilmati__cow-bells-02.wav";
import bell3 from "/sounds/481433__lilmati__cow-bells-03.wav";

const focusSound = new Audio(bell3);
const breakSound = new Audio(bell2);

export function playSound(nextMode: FocusState) {
  if (nextMode == "focus") {
    focusSound.play();
  } else {
    breakSound.play();
  }
}
