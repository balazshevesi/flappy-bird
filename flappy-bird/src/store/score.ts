// store/users.ts
import { atom } from "nanostores";

export const $score = atom({ value: 0 });
export function addPoint() {
  $score.set({ value: $score.get().value + 1 });
}
export function resetScore() {
  $score.set({ value: 0 });
}
