import { isEqual, isUndefined } from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { container } from '@/app.container';
import AuthService from './auth.service';

export function validateUnauthorizedError(error: any) {
  const authService = container.get(AuthService);
  const response = error.response;

  if (!isUndefined(response) && isEqual(response.status, StatusCodes.UNAUTHORIZED)) {
    authService
      .handleRedirect()
      .then(() => {
        authService.login().catch((error) => {
          console.error(error);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
