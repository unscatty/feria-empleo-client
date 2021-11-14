import { CompanyInvite } from '@/models/company/company-forms';
import { ICompany } from '@/models/company/company.interface';
import { AxiosResponse } from 'axios';
import { injectable as Injectable } from 'inversify';
import { ResourceService } from './interfaces/resource-service.interface';

@Injectable()
export class CompanyService extends ResourceService<ICompany> {
  static toFormaData(company: CompanyInvite): FormData {
    const formData = new FormData();

    for (const key in company) {
      if (Object.prototype.hasOwnProperty.call(company, key)) {
        formData.append(key, company[key]);
      }
    }

    return formData;
  }

  async invite(company: CompanyInvite, endpoint = '/invite') {
    const formData = CompanyService.toFormaData(company);

    const response = await this.axiosInstance.post<ICompany, AxiosResponse<ICompany>>(
      endpoint,
      formData,
      {
        headers: { ContentType: 'multipart/form-data' },
      }
    );

    return response.data;
  }

  async verifyInvitationToken(
    token: string,
    endpoint = '/validate-invitation-token',
    tokenName = 'token'
  ) {
    try {
      await this.axiosInstance.get(endpoint, {
        params: { [tokenName]: token },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async register(stateToken: string, endpoint = '/register') {
    const response = await this.axiosInstance.post<ICompany, AxiosResponse<ICompany>>(endpoint, {
      token: stateToken,
    });

    return response.data;
  }
}
