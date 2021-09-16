import { NavigationGuard, NavigationGuardNext, Route } from "vue-router";
import { container } from "@/app.container";
import AuthService from "./auth.service";

const AuthGuard: NavigationGuard = (from: Route, to: Route, next: NavigationGuardNext) => {
    // Get service from container
    const authService = container.get(AuthService);

    if (authService.isAuthenticated || to.name === 'Login') {
        next()
    }
    else {
        authService.login();
    }
}

export default AuthGuard;