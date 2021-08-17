import ObjectLiteral from '@/utils/object-literal.interface';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  IPaginationMeta,
  PaginationResponse,
} from '../../utils/pagination.interface';

export interface IResourceService<T> {
  getAll(...args: any[]): Promise<T[]> | T[];
  getById(id: string | number, ...args: any[]): Promise<T> | T;
  save(resource: T, ...args: any[]): Promise<T> | T | void;
  update(
    resource: T,
    id: string | number,
    ...args: any[]
  ): Promise<T> | T | void;
  delete(resource: T, id: string | number, ...args: any[]): void;
}

export class ResourceService<T extends { id?: string | number }>
  implements IResourceService<T> {
  protected axiosInstance: AxiosInstance;

  constructor(
    protected baseURL: string,
    protected resourceURL: string,
    timeout = 1_000
  ) {
    const url = new URL(this.resourceURL, this.baseURL);
    const instanceConfig: AxiosRequestConfig = {
      baseURL: url.toString(),
      timeout,
    };

    const token = localStorage.getItem(process.env.VUE_APP_B2C_TOKEN);
    if (token) {
      instanceConfig.headers = { Authorization: `Bearer ${token}` };
    }

    this.axiosInstance = axios.create(instanceConfig);
  }

  async getAll(config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.get<T, AxiosResponse<T[]>>(
      '/',
      config
    );
    return response.data;
  }

  async getAllPaginated<R extends ObjectLiteral = IPaginationMeta>(
    config?: AxiosRequestConfig
  ): Promise<PaginationResponse<T, R>> {
    const response = await this.axiosInstance.get<
      PaginationResponse<T, R>,
      AxiosResponse<PaginationResponse<T, R>>
    >('/', config);
    return response.data;
  }

  async getById(id: string | number, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.get<T, AxiosResponse<T>>(
      `/${id}`,
      config
    );

    return response.data;
  }

  async save(resource: T, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.post<T, AxiosResponse<T>>(
      '/',
      resource,
      config
    );

    return response.data;
  }

  async update(
    resource: T,
    id: string | number = resource.id,
    config?: AxiosRequestConfig
  ) {
    const response = await this.axiosInstance.put<T, AxiosResponse<T>>(
      `/${id}`,
      resource,
      config
    );

    return response.data;
  }

  async delete(
    resource: T,
    id: string | number = resource.id,
    config?: AxiosRequestConfig
  ) {
    return await this.axiosInstance.delete<T, AxiosResponse<void>>(
      `/${id}`,
      config
    );
  }
}
