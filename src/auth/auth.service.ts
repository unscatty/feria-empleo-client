import {
  AccountInfo,
  AuthenticationResult,
  Configuration,
  EndSessionRequest,
  InteractionRequiredAuthError,
  PublicClientApplication,
  RedirectRequest,
} from '@azure/msal-browser';
import { injectable as Injectable } from 'inversify-props';
import {
  ACCESS_TOKEN_KEY,
  CANDIDATE_REDIRECT_REQUEST,
  COMPANY_REDIRECT_REQUEST,
  loginRequest,
  LOGOUT_REDIRECT_URI,
  msalConfig,
  REQUEST_STATE_KEY,
  tokenRequest,
} from './auth.config';
import { b2cPolicies } from './policies';

@Injectable()
export default class AuthService {
  private clientApplication: PublicClientApplication;
  private _account: AccountInfo;

  constructor(
    config: Configuration = msalConfig,
    private logoutUri: string = LOGOUT_REDIRECT_URI,
    private TOKEN_KEY: string = ACCESS_TOKEN_KEY,
    private STATE_KEY: string = REQUEST_STATE_KEY,
    private defaultLoginRequest: RedirectRequest = loginRequest,
    private defaultTokenRequest: RedirectRequest = tokenRequest,
    private candidateRedirectRequest: Partial<
      RedirectRequest
    > = CANDIDATE_REDIRECT_REQUEST,
    private companyRedirectRequest: Partial<
      RedirectRequest
    > = COMPANY_REDIRECT_REQUEST,
    private policies: typeof b2cPolicies = b2cPolicies
  ) {
    this.clientApplication = new PublicClientApplication(config);

    this.clientApplication
      .handleRedirectPromise()
      .then((response) => {
        if (response) {
          /**
           * For the purpose of setting an active account for UI update, we want to consider only the auth response resulting
           * from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy policies may use "acr" instead of "tfp").
           * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
           */
          const responseTokenClaims = response.idTokenClaims as any;
          if (
            responseTokenClaims['tfp'].toUpperCase() ===
            this.policies.names.signUpSignIn.toUpperCase()
          ) {
            this.handleResponse(response);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // In case of page refresh
    this.selectAccount();

    console.log(this.account);
  }

  get client() {
    return this.clientApplication;
  }

  get account() {
    return this._account;
  }

  get isAuthenticated() {
    return Boolean(this.getToken())
  }

  private setAccount(account: AccountInfo) {
    this._account = account;
  }

  private clearStore() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.STATE_KEY);
  }

  private storeState(state: string) {
    localStorage.setItem(this.STATE_KEY, state);
  }

  private storeAccessToken(accessToken: string) {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
  }

  private storeResponseItems(response: AuthenticationResult) {
    this.storeAccessToken(response.accessToken);
    this.storeState(response.state);
  }

  async handleResponse(response: AuthenticationResult) {
    if (response) {
      this.setAccount(response.account);
      this.storeResponseItems(response);
    } else {
      this.selectAccount();
    }
  }

  private selectAccount() {
    const currentAccounts = this.clientApplication.getAllAccounts();

    if (currentAccounts.length < 1) {
      return;
    } else if (currentAccounts.length > 1) {
      /**
       * Due to the way MSAL caches account objects, the auth response from initiating a user-flow
       * is cached as a new account, which results in more than one account in the cache. Here we make
       * sure we are selecting the account with homeAccountId that contains the sign-up/sign-in user-flow,
       * as this is the default flow the user initially signed-in with.
       */
      const accounts = currentAccounts.filter((account) => {
        const accountTokenClaims = account.idTokenClaims as any;
        return (
          account.homeAccountId
            .toUpperCase()
            .includes(this.policies.names.signUpSignIn.toUpperCase()) &&
          accountTokenClaims.iss
            .toUpperCase()
            .includes(this.policies.authorityDomain.toUpperCase()) &&
          accountTokenClaims.aud === msalConfig.auth.clientId
        );
      });

      if (accounts.length > 1) {
        // localAccountId identifies the entity for which the token asserts information.
        if (
          accounts.every(
            (account) => account.localAccountId === accounts[0].localAccountId
          )
        ) {
          // All accounts belong to the same user
          this.setAccount(accounts[0]);
        } else {
          // Multiple users detected. Logout all to be safe.
          this.logout();
        }
      } else if (accounts.length === 1) {
        this.setAccount(accounts[0]);
      }
    } else if (currentAccounts.length === 1) {
      this.setAccount(currentAccounts[0]);
    }
  }

  login(
    request?: Partial<RedirectRequest>,
    extra?: Partial<Omit<RedirectRequest, 'redirectUri'>>
  ): Promise<void> {
    const redirectRequest: RedirectRequest = {
      // Default scopes
      ...this.defaultLoginRequest,
      // Override options (primarily redirect URI)
      ...request,
      // Merge extra arguments
      ...extra,
    };

    return this.clientApplication.loginRedirect(redirectRequest);
  }

  loginCompany(extra?: Partial<Omit<RedirectRequest, 'redirectUri'>>) {
    this.login(this.companyRedirectRequest, extra);
  }

  loginCandidate(extra?: Partial<Omit<RedirectRequest, 'redirectUri'>>) {
    this.login(this.candidateRedirectRequest, extra);
  }

  logout(request?: EndSessionRequest) {
    const logoutRequest: EndSessionRequest = {
      postLogoutRedirectUri: this.logoutUri,
      ...request,
    };

    this.clearStore();

    return this.clientApplication.logoutRedirect(logoutRequest);
  }

  getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getState() {
    return localStorage.getItem(this.STATE_KEY);
  }

  async getTokenRedirect(request: RedirectRequest) {
    /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    request.account = this.clientApplication.getAccountByHomeId(
      this.account.homeAccountId
    );

    try {
      const response = await this.clientApplication.acquireTokenSilent(request);
      // In case the response from B2C server has an empty accessToken field
      // throw an error to initiate token acquisition
      if (!response.accessToken || response.accessToken === '') {
        throw new InteractionRequiredAuthError();
      } else {
        // Set access_token for later retrieval
        this.storeResponseItems(response);
      }
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        console.log(
          'Silent token acquisition fails. Acquiring token using redirect. \n',
          error
        );
        // fallback to interaction when silent call fails
        return this.clientApplication.acquireTokenRedirect(request);
      } else {
        console.error(error);
      }
    }
  }
}
