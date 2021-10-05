import { container } from "@/app.container";
import { CurrentUserService } from "@/services/current-user.service";
import { CustomNavGuard, CustomRoute } from "@/utils/custom-route.types";
import { NavigationGuardNext } from "vue-router";

// Gets current user info from backend or uses already fetched data
const CurrentUserGuard: CustomNavGuard = async (to: CustomRoute, from: CustomRoute, next: NavigationGuardNext) => {
  const currentUserService = container.get(CurrentUserService);
  try {
    // Use already fetch data if present
    await currentUserService.fetch(true);
    next()
  } catch (error) {
    next('/');
  }
}

export default CurrentUserGuard;