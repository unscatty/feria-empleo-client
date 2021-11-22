import { CustomNavGuard } from '@/utils/custom-route.types';
import { NavigationGuardNext } from 'vue-router';

export const createReleaseDateGuard = (
  releaseDate: Date,
  redirect: Parameters<NavigationGuardNext>[0]
): CustomNavGuard => {
  return (_, __, next) => {
    if (new Date() < releaseDate) {
      next(redirect);
    } else {
      next();
    }
  };
};

export const createPostReleaseDateGuard = (
  releaseDate: Date,
  redirect: Parameters<NavigationGuardNext>[0]
): CustomNavGuard => {
  return (_, __, next) => {
    if (new Date() >= releaseDate) {
      next(redirect);
    } else {
      next();
    }
  };
};
