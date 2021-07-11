import * as Msal from 'msal';
import * as dotenv from "dotenv";
import msalConfiguration from './auth.config';

dotenv.config();

export class AuthService {

  private tokenKey: string;
  public token: string;
  private clientApplication: Msal.UserAgentApplication;

  constructor() {
    this.tokenKey = process.env.VUE_APP_B2C_TOKEN || "";
    this.token = "";
    this.clientApplication = {} as any;
    this.setClientApplication();
  }

  /**
   * @returns string The acces token sent by azure
   */
  public getToken(): string {
    const token = localStorage.getItem(this.tokenKey);
    return token || "";
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

  public login(): void {
    this.clientApplication.loginRedirect()
  }

  /**
   * @return void
   */
  private setClientApplication() {
    this.clientApplication = new Msal.UserAgentApplication( msalConfiguration.getConfiguration());
  }
}
