import { NavigationGuard, NavigationGuardNext, Route } from "vue-router"
import { CustomNavGuard } from "./custom-route.types";

function evaluateGuards(guards: NavigationGuard[], to: Route, from: Route, next: NavigationGuardNext) {
  const guardsLeft = guards.slice(0); // clone the array so we do not accidentally modify it
  const nextGuard = guardsLeft.shift();

  if (!nextGuard) {
    next();
    return;
  }

  nextGuard(to, from, (nextArg) => {
    if (!nextArg) {
      evaluateGuards(guardsLeft, to, from, next);
      return;
    }

    next(nextArg);
  });
}

function MultiGuard(...guards: CustomNavGuard[]): CustomNavGuard {
  return (to, from, next) => {
    // Skip guards if route is marked public
    if (to.meta.isPublic) {
      return next();
    }

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