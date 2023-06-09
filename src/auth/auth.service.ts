import {
  AccountInfo,
  AuthenticationResult,
  Configuration,
  EndSessionRequest,
  InteractionRequiredAuthError,
  PublicClientApplication,
  RedirectRequest,
  SilentRequest,
} from '@azure/msal-browser';
import { injectable as Injectable } from 'inversify';
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

  constructor(
    config: Configuration = msalConfig,
    private logoutUri: string = LOGOUT_REDIRECT_URI,
    private TOKEN_KEY: string = ACCESS_TOKEN_KEY,
    private STATE_KEY: string = REQUEST_STATE_KEY,
    private defaultLoginRequest: RedirectRequest = loginRequest,
    private defaultTokenRequest: SilentRequest = tokenRequest,
    private candidateRedirectRequest: Partial<RedirectRequest> = CANDIDATE_REDIRECT_REQUEST,
    private companyRedirectRequest: Partial<RedirectRequest> = COMPANY_REDIRECT_REQUEST,
    private policies: typeof b2cPolicies = b2cPolicies
  ) {
    this.clientApplication = new PublicClientApplication(config);
  }

  protected get client() {
    return this.clientApplication;
  }

  public get account() {
    return this.clientApplication.getActiveAccount();
  }

  public get state() {
    return localStorage.getItem(this.STATE_KEY);
  }

  public get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public get isAuthenticated() {
    return Boolean(this.account);
  }

  private setAccount(account: AccountInfo) {
    this.clientApplication.setActiveAccount(account);
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

  public async handleRedirect() {
    try {
      const result = await this.clientApplication.handleRedirectPromise();

      if (result) {
        /**
         * For the purpose of setting an active account for UI update, we want to consider only the auth response resulting
         * from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy policies may use "acr" instead of "tfp").
         * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
         */
        const responseTokenClaims = result.idTokenClaims as any;
        if (
          responseTokenClaims['tfp'].toUpperCase() ===
          this.policies.names.signUpSignIn.toUpperCase()
        ) {
          this.handleResponse(result);
        }
      }
    } catch (error) {
      console.log(error);
    }

    // In case of page refresh
    this.selectAccount();
  }

  handleResponse(response: AuthenticationResult) {
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
        if (accounts.every((account) => account.localAccountId === accounts[0].localAccountId)) {
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

  async login(
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

  async registerCompany(extra?: Partial<Omit<RedirectRequest, 'redirectUri' | 'redirectStartPage'>>) {
    this.login(this.companyRedirectRequest, extra);
  }

  async registerCandidate(extra?: Partial<Omit<RedirectRequest, 'redirectUri' | 'redirectStartPage'>>) {
    this.login(this.candidateRedirectRequest, extra);
  }

  async logout(request?: Omit<EndSessionRequest, 'account'>) {
    const logoutRequest: EndSessionRequest = {
      postLogoutRedirectUri: this.logoutUri,
      account: this.account,
      ...request,
    };

    this.clearStore();

    return this.clientApplication.logoutRedirect(logoutRequest);
  }

  getToken(): string {
    return this.token;
  }

  getState() {
    return this.state;
  }

  async getTokenRedirect(request: SilentRequest = this.defaultTokenRequest) {
    /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    request.account = this.clientApplication.getAccountByHomeId(this.account?.homeAccountId);

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
        console.log('Silent token acquisition fails. Acquiring token using redirect. \n', error);
        // fallback to interaction when silent call fails
        return this.clientApplication.acquireTokenRedirect(request);
      } else {
        console.error(error);
      }
    }
  }
}
