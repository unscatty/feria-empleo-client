import { validateUnauthorizedError } from '@/auth/auth.validatod';
import axios from 'axios';

export class CompaniesComponent {
  public companies: any[];

  public async getCompanies() {
    try {
      this.companies = await (await axios.get('/company')).data.items;
    } catch (error) {
      validateUnauthorizedError(error);
    }
  }
}
