import { container } from '@/app.container';
import AuthService from '@/auth/auth.service';
import { CurrentUserService } from '@/services/current-user.service';
import { CustomNavGuard, CustomRoute } from '@/utils/custom-route.types';
import { NavigationGuardNext } from 'vue-router';

// Gets current user info from backend or uses already fetched data
const CurrentUserGuard: CustomNavGuard = async (
  to: CustomRoute,
  from: CustomRoute,
  next: NavigationGuardNext
) => {
  const currentUserService = container.get(CurrentUserService);
  try {
    // Use already fetch data if present
    await currentUserService.fetch(true);
    next();
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      const errorCode = error.response.data.error;
      if (error.response.status === 401) {
        const authService = container.get(AuthService);
        await authService.login();
      } else {
        switch (errorCode) {
          case 'NOT_USER_REGISTER':
            console.log('redirect to registration');
            next('/registro');
            break;
          default:
            next(new Error(errorCode));
            break;
        }
      }
    }

    next(new Error('User does not exist'));
  }
};

export default CurrentUserGuard;
