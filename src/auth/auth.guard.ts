import { NavigationGuardNext } from "vue-router";
import { container } from "@/app.container";
import AuthService from "./auth.service";
import { CustomNavGuard, CustomRoute } from "@/utils/custom-route.types";

const AuthGuard: CustomNavGuard = async (to: CustomRoute, from: CustomRoute, next: NavigationGuardNext) => {    
    // Get service from container
    const authService = container.get(AuthService);

    // Wait for any interaction in progress
    await authService.handleRedirect();

    // If route marked as public skip authentication
    if (authService.isAuthenticated || to.meta?.isPublic) {
        next()
    }
    else {
        await authService.login();
    }
}

export default AuthGuard;