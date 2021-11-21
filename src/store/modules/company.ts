import { lazyInject } from '@/app.container';
import { CompanyUpdate } from '@/models/company/company-forms';
import ICompany, { CompanyEmailOptions } from '@/models/company/company.interface';
import { CompanyService } from '@/services/company.service';
import { CurrentUserService } from '@/services/current-user.service';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

export enum COMPANY_MUTATIONS {
  SET_IMAGE_URL = 'SET_IMAGE_URL',
  SET_CURRENT = 'SET_CURRENT',
  SET_TO_UPDATE = 'SET_TO_UPDATE',
  SET_IMAGE_FILE_UPDATE = 'SET_IMAGE_FILE_UPDATE',
  SET_UPDATE_EMAIL = 'SET_UPDATE_EMAIL',
}

export type ImageFileUpdate = { update: boolean; imageFile: File };

export type UpdateEmailOptions = { update: boolean; useEmail: CompanyEmailOptions };

@Module({ namespaced: true })
export default class CompanyStore extends VuexModule<any> {
  @lazyInject(CompanyService)
  companyService: CompanyService;

  @lazyInject(CurrentUserService)
  currentUserService: CurrentUserService;

  current: ICompany = {
    name: '',
    invitationEmail: '',
    createdAt: undefined,
    updatedAt: undefined,
  };

  toUpdate: ICompany = {
    name: '',
    invitationEmail: '',
    createdAt: undefined,
    updatedAt: undefined,
  };

  updateEmail: UpdateEmailOptions = {
    update: false,
    useEmail: null,
  };

  imageUpdate: ImageFileUpdate = {
    update: false,
    imageFile: null,
  };

  get companyToUpdate() {
    return this.toUpdate;
  }

  @Mutation
  [COMPANY_MUTATIONS.SET_IMAGE_URL](imageURL: string) {
    if (imageURL) {
      this.current.imageURL = imageURL;
    }
  }

  @Mutation
  [COMPANY_MUTATIONS.SET_CURRENT](company: ICompany) {
    this.current = company;
  }

  @Mutation
  [COMPANY_MUTATIONS.SET_TO_UPDATE](company: ICompany) {
    this.toUpdate = company;
  }

  @Mutation
  [COMPANY_MUTATIONS.SET_IMAGE_FILE_UPDATE](imageFileUpdate: ImageFileUpdate) {
    this.imageUpdate = imageFileUpdate;
  }

  @Mutation
  [COMPANY_MUTATIONS.SET_UPDATE_EMAIL](updateEmail: UpdateEmailOptions) {
    this.updateEmail = updateEmail;
  }

  @Action
  setImageFile(fileUpdate: ImageFileUpdate) {
    this.context.commit(COMPANY_MUTATIONS.SET_IMAGE_FILE_UPDATE, fileUpdate);
  }

  @Action
  setCurrent(company: ICompany = this.currentUserService.asCompany) {
    this.context.commit(COMPANY_MUTATIONS.SET_CURRENT, company);
  }

  @Action
  setToUpdate(company: ICompany) {
    this.context.commit(COMPANY_MUTATIONS.SET_TO_UPDATE, company);
  }

  @Action
  setUpdateEmail(updateEmail: UpdateEmailOptions) {
    this.context.commit(COMPANY_MUTATIONS.SET_UPDATE_EMAIL, updateEmail);
  }

  @Action
  async setCompany() {
    await this.currentUserService.fetch(true);

    const company = this.currentUserService.asCompany;

    this.context.commit(COMPANY_MUTATIONS.SET_CURRENT, company);
    this.context.commit(COMPANY_MUTATIONS.SET_TO_UPDATE, company);
  }

  @Action({ rawError: true })
  async updateCurrent() {
    const companyUpdate: CompanyUpdate = {
      name: this.toUpdate.name,
      description: this.toUpdate.description,
      staff: this.toUpdate.staff,
      user: {
        name: this.toUpdate.user.name,
        lastname: this.toUpdate.user.lastname,
      },
    };

    if (this.updateEmail.update && this.updateEmail.useEmail) {
      companyUpdate.useEmail = this.updateEmail.useEmail;
    }

    const updatedCompany = await this.companyService.updateCurrent(companyUpdate);

    this.context.commit(COMPANY_MUTATIONS.SET_CURRENT, updatedCompany);

    this.context.dispatch('sync');
  }

  @Action({ rawError: true })
  async updateImageCurrent() {
    if (this.imageUpdate.update && this.imageUpdate.imageFile !== null) {
      const updatedImageURL = this.companyService.updateImageCurrent({
        image: this.imageUpdate.imageFile,
      });

      this.context.commit(COMPANY_MUTATIONS.SET_IMAGE_URL, updatedImageURL);
    }
  }

  @Action
  sync() {
    this.currentUserService.raw = this.current;
  }
}

export const COMPANY_STORE_NAME = 'CompanyStore';
