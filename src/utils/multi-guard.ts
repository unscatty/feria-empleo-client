import { NavigationGuard, NavigationGuardNext, Route } from "vue-router"
import { CustomNavGuard } from "./custom-route.types";

async function evaluateGuards(guards: NavigationGuard[], to: Route, from: Route, next: NavigationGuardNext) {
  const guardsLeft = guards.slice(0); // clone the array so we do not accidentally modify it
  const nextGuard = guardsLeft.shift();

  if (!nextGuard) {
    next();
    return;
  }

  await nextGuard(to, from, (nextArg) => {
    if (!nextArg) {
      evaluateGuards(guardsLeft, to, from, next);
      return;
    }

    next(nextArg);
  });
}

export function MultiGuard(...guards: CustomNavGuard[]): CustomNavGuard {
  return (to, from, next) => {
    return evaluateGuards(guards, to, from, next);
  }
}

export default function createMultiGuard(...defaultGuards: CustomNavGuard[]) {
  return (...guards: CustomNavGuard[]) => {
    // Prepend default guards to guard array
    const allGuards = defaultGuards.concat(guards);
    return MultiGuard(...allGuards);
  }
}