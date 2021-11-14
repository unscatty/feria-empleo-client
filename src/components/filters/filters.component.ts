import axios from 'axios';

const jobTypeEnum: any = {
  'Tiempo Completo': 'full_time',
  'Medio tiempo': 'part_time',
};

const modalityEnum: any = {
  Remoto: 'home_office',
  Presencial: 'office',
  Hybrid: 'hybrid',
};
export class FiltersComponent {
  public employers: string[];
  public type: string;
  public modality: string;
  public experience: string | null;
  public employerId: number | null;

  constructor() {
    this.employers = [];
    this.type = '';
    this.modality = '';
    this.employerId = null;
    this.experience = null;
  }

  public selectType(context: any, type: any): void {
    this.type = type.target.value;
    context.$emit('type', jobTypeEnum[this.type]);
  }

  public clearType(context: any): void {
    this.type = '';
    context.$emit('type', null);
  }

  public selectModality(context: any, modality: any): void {
    this.modality = modality.target.value;
    context.$emit('modality', modalityEnum[this.modality]);
  }

  public clearModality(context: any): void {
    this.modality = '';
    context.$emit('modality', null);
  }

  public selectExperience(context: any, experience: any): void {
    context.$emit('experience', experience.target.value);
  }

  public clearExperience(context: any): void {
    this.experience = null;
    context.$emit('experience', null);
  }

  public selectCompany(context: any, companyId: any) {
    context.$emit('employerId', companyId.target.value);
  }

  public clearCompany(context: any): void {
    this.employerId = null;
    context.$emit('employerId', null);
  }

  public clearAllFilters(context: any): void {
    this.clearType(context);
    this.clearModality(context);
    this.clearExperience(context);
    this.clearCompany(context);
    context.$emit('type', null);
  }

  public async getEmployers() {
    this.employers = await (await axios.get('/company')).data;
  }
}
