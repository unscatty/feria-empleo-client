import { NavigationGuard, NavigationGuardNext, Route } from "vue-router";
import { cid, container } from "inversify-props";
import AuthService from "./auth.service";

const AuthGuard: NavigationGuard = (from: Route, to: Route, next: NavigationGuardNext) => {
    // Get service from container
    const authService = container.get<AuthService>(cid.AuthService);

    if (authService.isAuthenticated || to.name === 'Login') {
        next()
    }
    else {
        authService.login();
    }
}

export default AuthGuard;