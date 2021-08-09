import * as Msal from 'msal';
import * as dotenv from 'dotenv';
import msalConfiguration from './auth.config';
import { AuthenticationParameters } from 'msal';

dotenv.config();

export class AuthService {
  private tokenKey: string;
  public token: string;
  public clientApplication: Msal.UserAgentApplication;
  // public ha

  constructor() {
    this.tokenKey = process.env.VUE_APP_B2C_TOKEN || '';
    this.token = '';
    this.clientApplication = {} as any;
    this.setClientApplication();

    this.clientApplication.handleRedirectCallback((error, response) => {
      console.log(response?.accountState);
      console.log(localStorage);

      localStorage.setItem('accountState', response?.accountState || '');
    });
  }

  /**
   * @returns string The acces token sent by azure
   */
  public getToken(): string {
    const token = localStorage.getItem(this.tokenKey);
    return token || '';
  }

  /**
   * @description Close the session in Azure
   * @return void
   */
  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.clear();
    sessionStorage.clear();
    this.clientApplication.logout();
  }

  public login(userRequest?: AuthenticationParameters): void {
    this.clientApplication.loginRedirect(userRequest);
  }

  /**
   * @return void
   */
  private setClientApplication() {
    this.clientApplication = new Msal.UserAgentApplication(
      msalConfiguration.getConfiguration()
    );
  }
}
