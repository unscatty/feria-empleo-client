import { ICompany } from '@/models/company/company.interface';
import { AxiosResponse } from 'axios';
import ObjectLiteral from '../utils/object-literal.interface';
import { ResourceService } from './interfaces/resource-service.interface';

export interface CompanyInvite extends ObjectLiteral {
  name: string;
  email: string;
  image: File;
}

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

  async invite(company: CompanyInvite) {
    const formData = CompanyService.toFormaData(company);

    const response = await this.axiosInstance.post<
      ICompany,
      AxiosResponse<ICompany>
    >('/invite', formData, {
      headers: { ContentType: 'multipart/form-data' },
    });

    return response.data;
  }
}
