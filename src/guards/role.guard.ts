import { container } from '@/app.container';
import RoleType from '@/models/role.type';
import { CurrentUserService } from '@/services/current-user.service';
import {
  CustomNavGuard,
  CustomRoute,
  PermissionsConfig,
  RouteAccess,
  RouteWithNoAccess,
} from '@/utils/custom-route.types';
import { NavigationGuardNext } from 'vue-router';

export function hasAccessToRoute(role: RoleType, route: CustomRoute): RouteAccess {
  if (route.meta?.isPublic) {
    return { access: true };
  }

  let permissions: PermissionsConfig = null;

  if (route.meta?.permissions) {
    permissions = route.meta.permissions;
  } else if (route.matched?.length > 1) {
    if (route.matched[0]?.meta) {
      permissions = route.matched[0]?.meta?.permissions as PermissionsConfig;
    }
  }

  if (!permissions) {
    // TODO: define default access logic here
    // No rules defined, access is granted
    return { access: true };
  }

  const matchedRole = permissions.roles?.find((roleConfig) => roleConfig.role === role);

  return matchedRole || permissions.default;
}

const RoleGuard: CustomNavGuard = (
  to: CustomRoute,
  from: CustomRoute,
  next: NavigationGuardNext
) => {
  const currentUserService = container.get(CurrentUserService);
  const userRole = currentUserService.role;

  const routeAccess = hasAccessToRoute(userRole, to);

  if (routeAccess.access) {
    // Route is accessible by current user
    next();
  } else {
    // Route not accessible, redirect
    next((routeAccess as RouteWithNoAccess).redirect);
  }
};

export default RoleGuard;
