import { CacheLocation, Logger } from 'msal';

// Protocol Support
export interface AuthOptions  {
    clientId: string;
    authority?: string;
    validateAuthority?: boolean;
    redirectUri?: string | (() => string);
    postLogoutRedirectUri?: string | (() => string);
    navigateToLoginRequestUrl?: boolean;
}

// Cache Support
export interface CacheOptions  {
    cacheLocation?: CacheLocation;
    storeAuthStateInCookie?: boolean;
}

// Library support
export interface SystemOptions  {
    logger?: Logger;
    loadFrameTimeout?: number;
    tokenRenewalOffsetSeconds?: number;
    navigateFrameWait?: number;
}

// Developer App Environment Support
export interface FrameworkOptions  {
    isAngular?: boolean;
    unprotectedResources?: Array<string>;
    protectedResourceMap?: Map<string, Array<string>>;
}

// Configuration Object
export interface Configuration  {
    auth: AuthOptions;
    cache?: CacheOptions;
    system?: SystemOptions;
    framework?: FrameworkOptions;
}
