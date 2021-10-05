import { ICandidate } from '@/models/candidate/candidate.interface';
import { ICompany } from '@/models/company/company.interface';
import RoleType from '@/models/role.type';
import { IAdmin } from '@/models/user/user.interface';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { injectable as Injectable } from 'inversify-props';

export type UserType = IAdmin | ICompany | ICandidate;

@Injectable()
export class CurrentUserService {
  protected axiosInstance: AxiosInstance;
  private _currentUser: UserType;

  constructor(
    protected baseURL: string,
    protected resourceURL: string,
    timeout = 1_000,
  ) {
    const url = new URL(this.resourceURL, this.baseURL);
    const instanceConfig: AxiosRequestConfig = {
      baseURL: url.toString(),
      timeout,
    };

    this.axiosInstance = axios.create(instanceConfig);

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(process.env.VUE_APP_B2C_TOKEN);

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },

      (error) => {
        return Promise.reject(error);
      }
    );
  }

  get raw() {
    return this._currentUser;
  }

  set raw(value: UserType) {
    this._currentUser = value;
  }

  get role(): RoleType {
    // FIXME: check role serialization structure
    return this.raw.user.role.name;
  }

  get currentUser(): UserType {
    switch (this.role) {
      case RoleType.ADMIN:
        return this.asAdmin;

      case RoleType.COMPANY:
        return this.asCompany;

      case RoleType.CANDIDATE:
        return this.asCandidate;
    }
  }

  get asCompany(): ICompany {
    return this.raw as ICompany;
  }

  get asCandidate(): ICandidate {
    return this.raw as ICandidate;
  }

  get asAdmin(): IAdmin {
    return this.raw as IAdmin;
  }

  private is(role: RoleType) {
    return this.role === role;
  }

  get isAdmin() {
    return this.is(RoleType.ADMIN);
  }

  get isCandidate() {
    return this.is(RoleType.CANDIDATE);
  }

  get isCompany() {
    return this.is(RoleType.COMPANY);
  }

  async fetch(cached = false): Promise<UserType> {
    // Get from previous backend call
    if (cached && this.raw) {
      return this.raw;
    }

    // Get from backend
    const response = await this.axiosInstance.get<UserType, AxiosResponse<UserType>>('/');
    this.raw = response.data;

    return this.raw;
  }

  get isPresent() {
    return !!this.raw;
  }

  clear() {
    this._currentUser = null;
  }
}