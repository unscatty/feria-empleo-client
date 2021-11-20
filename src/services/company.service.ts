import { objectToFormData } from '@/helpers/form';
import { CompanyInvite, CompanyUpdate, CompanyUpdateImage } from '@/models/company/company-forms';
import ICompany from '@/models/company/company.interface';
import { AxiosResponse } from 'axios';
import { injectable as Injectable } from 'inversify';
import { ResourceService } from './interfaces/resource-service.interface';

@Injectable()
export class CompanyService extends ResourceService<ICompany> {
  async invite(company: CompanyInvite, endpoint = '/invite') {
    const formData = objectToFormData(company);

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

  async updateCurrent(company: CompanyUpdate) {
    const response = await this.axiosInstance.put<ICompany, AxiosResponse<ICompany>>('', company);

    return response.data;
  }

  async updateImageCurrent(image: CompanyUpdateImage, endpoint = '/update-image') {
    const formData = objectToFormData(image);

    const response = await this.axiosInstance.patch<string>(endpoint, formData);

    return response.data;
  }
}
