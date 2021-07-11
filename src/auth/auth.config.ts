import { LogLevel, Logger  } from 'msal';
import * as dotenv from "dotenv";
import { FrameworkOptions, Configuration, AuthOptions, CacheOptions, SystemOptions } from 'msal/lib-commonjs/Configuration';

dotenv.config();

export function loggerCallback(logLevel: LogLevel.Verbose, message: string , piiEnabled: true) {}

const scopes = ['openid', `https://${process.env.VUE_APP_B2C_TENANT}/helix-auth/user_impersonation`]

class MsalConfiguration {

  private resourceMap: any;
  private configuration: Configuration;

  constructor() {
    this.configuration = {} as any;
    this.setResourceMap();
    this.setConfiguration();
  }

  /**
   * @param LogLevel.Verbose logLevel The log level
   * @param string message The message thas is going to be sended
   * @param true piiEnabled The pii
   */
  public loggerCallback(logLevel: LogLevel, message: string, piiEnabled: boolean) { }

  /**
   * @returns
   * @memberof MsalConfiguration
   */
  public getConfiguration() {
    return this.configuration;
  }

  /**
   * @private
   * @memberof MsalConfiguration
   */
  private setResourceMap(): void {
    this.resourceMap =  [ scopes ];
  }

  /**
   * @private
   * @returns {AuthOptions}
   * @memberof MsalConfiguration
   */
  private getAuthOptions(): AuthOptions {
    return {
      clientId:  process.env.VUE_APP_B2C_CLIENTID || "",
      authority: `https://Helix123Auth.b2clogin.com/tfp/${process.env.VUE_APP_B2C_TENANT}/${process.env.VUE_APP_B2C_SIGNINPOLICY}`,
      validateAuthority: false,
      redirectUri: process.env.VUE_APP_B2C_REDIRECTURI || "",
      postLogoutRedirectUri: process.env.VUE_APP_B2C_REDIRECTURI || "",
      navigateToLoginRequestUrl: false,
    };
  }

  /**
   * @private
   * @returns {CacheOptions}
   * @memberof MsalConfiguration
   */
  private getCacheOptions(): CacheOptions {
    return {
      cacheLocation: 'localStorage',
    };
  }

  /**
   * @private
   * @returns {SystemOptions}
   * @memberof MsalConfiguration
   */
  private getSystemOptions(): SystemOptions {
    return {
      logger: new Logger( this.loggerCallback , {
        level: LogLevel.Info,
        correlationId: '03da1969-a5dc-45ef-bcc3-55283ea47a7f',
        piiLoggingEnabled: true,
      }),
    };
  }

  /**
   * @private
   * @returns {FrameworkOptions}
   * @memberof MsalConfiguration
   */
  private getFrameworkOptions(): FrameworkOptions {
    return {
      isAngular: true,
      unprotectedResources:  ['https://www.microsoft.com/en-us/'],
      protectedResourceMap: this.resourceMap
    };
  }

  /**
   * @private
   * @memberof MsalConfiguration
   */
  private setConfiguration() {
    this.configuration = {
      auth: this.getAuthOptions(),
      cache: this.getCacheOptions(),
      system: this.getSystemOptions(),
      framework: this.getFrameworkOptions()
    };
  }
}


const msalConfiguration = new MsalConfiguration();
export default msalConfiguration;
