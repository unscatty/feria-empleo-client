import { NavigationGuard, NavigationGuardNext, Route } from "vue-router";
import { container } from "@/app.container";
import AuthService from "./auth.service";

const AuthGuard: NavigationGuard = async (from: Route, to: Route, next: NavigationGuardNext) => {
    // Get service from container
    const authService = container.get(AuthService);

    // Wait for any interaction in progress
    await authService.handleRedirect();

    // TODO: import login route and use it here
    if (authService.isAuthenticated || to.name === 'Login') {
        next()
    }
    else {
        await authService.login();
    }
}

export default AuthGuard;