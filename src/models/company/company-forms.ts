import ObjectLiteral from '@/utils/object-literal.interface';
import { ICompany } from './company.interface';

export interface CompanyInvite extends ObjectLiteral, Pick<ICompany, 'name'> {
  name: string;
  email: string;
  image: File;
}
