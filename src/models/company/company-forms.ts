import ObjectLiteral from '@/utils/object-literal.interface';
import { UserUpdateFields } from '../user/user.interface';
import { CompanyEmailOptions } from './company.interface';

export interface CompanyInvite extends ObjectLiteral {
  name: string;
  email: string;
  image: File;
}

export interface CompanyUpdate extends ObjectLiteral {
  name?: string;
  description?: string;
  staff?: string;
  user?: UserUpdateFields;
  useEmail?: CompanyEmailOptions;
}

export interface CompanyUpdateImage {
  image: File;
}
