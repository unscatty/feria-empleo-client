import { Action, Module, VuexModule } from 'vuex-module-decorators';

import AuthService from '@/auth/auth.service';

export const AUTH_STORE_NAME = 'authStore';

@Module({ name: AUTH_STORE_NAME, namespaced: true })
export default class AuthStore extends VuexModule {
  authService = new AuthService();

  get isAuthenticated() {
    return Boolean(this.accessToken);
  }

  get accessToken() {
    return this.authService.getToken();
  }

  get responseState() {
    return this.authService.getState();
  }

  @Action
  public login(...params: Parameters<typeof AuthService.prototype.login>) {
    return this.authService.login(...params);
  }

  @Action
  loginCompany(
    ...params: Parameters<typeof AuthService.prototype.loginCompany>
  ) {
    return this.authService.loginCompany(...params);
  }

  @Action
  loginCandidate(
    ...params: Parameters<typeof AuthService.prototype.loginCandidate>
  ) {
    return this.authService.loginCandidate(...params);
  }

  @Action
  public logout(...params: Parameters<typeof AuthService.prototype.logout>) {
    return this.authService.logout(...params);
  }
}
