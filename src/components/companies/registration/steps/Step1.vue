<template>
  <v-container>
    <v-row no-gutters align="center">
      <v-col sm="12" md="6">
        <avatar-change ref="avatarChange"></avatar-change>
      </v-col>
      <v-col sm="12" md="6">
        <p class="text-md-h5 text-h6">Datos de la empresa</p>
        <br />
        <v-form ref="form" v-model="isValid" lazy-validation>
          <v-text-field
            v-model="companyToUpdate.name"
            :rules="[rules.minLength(4, companyToUpdate.name)]"
            label="Nombre de la empresa"
            required
          ></v-text-field>
          <br />
          <template v-if="!mailsAreEqual">
            <p>
              <span class="subtitle-2 inline">Selecciona una dirección de correo electrónico</span>
              <span class="caption text--secondary inline">
                A está dirección llegará una notificación cada que apliquen a una vacante
              </span>
            </p>
            <v-select
              v-model="currentEmailOption"
              :rules="[rules.required]"
              class="mt-n4"
              :hint="currentEmailOption.hint"
              :items="availableEmails"
              item-text="email"
              item-value="option"
              persistent-hint
              return-object
              single-line
              :prepend-icon="currentEmailOption.icon"
            ></v-select>
          </template>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Actionable from '@/helpers/actionable.interface';
import { rules } from '@/helpers/form';
import ValidableForm from '@/helpers/validable-form.interface';
import ICompany, { CompanyEmailOptions } from '@/models/company/company.interface';
import CompanyStore, { COMPANY_STORE_NAME } from '@/store/modules/company';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import AvatarChange from './components/AvatarChange.vue';

const companyStore = namespace(COMPANY_STORE_NAME);

type EmailOption = { email: string; option: CompanyEmailOptions; icon?: string; hint?: string };

@Component({ components: { AvatarChange } })
export default class Step1 extends Vue implements Actionable, ValidableForm {
  currentEmailOption_: EmailOption = {
    email: '',
    option: null,
  };

  isValid = true;

  rules = rules;

  @Ref('avatarChange')
  avatarChangeRef: AvatarChange;

  @Ref('form')
  formRef: ValidableForm;

  @companyStore.State('toUpdate')
  readonly companyToUpdate: ICompany;

  @companyStore.Action(CompanyStore.prototype.setToUpdate.name)
  setCompanyToUpdate: typeof CompanyStore.prototype.setToUpdate;

  @companyStore.Action(CompanyStore.prototype.setUpdateEmail.name)
  setUpdateEmail: typeof CompanyStore.prototype.setUpdateEmail;

  get updateEmail() {
    // Is different email has been chosen, email needs to be updated
    return this.currentEmailOption.email !== this.companyToUpdate.activeEmail;
  }

  get mailsAreEqual(): boolean {
    return this.companyToUpdate?.invitationEmail === this.companyToUpdate?.user?.email;
  }

  get currentEmailOption(): EmailOption {
    if (this.currentEmailOption_.email && this.currentEmailOption_.option) {
      return this.currentEmailOption_;
    } else {
      return this.availableEmails.find(
        (option) => option.email === this.companyToUpdate.activeEmail
      );
    }
  }

  set currentEmailOption(value: EmailOption) {
    this.currentEmailOption_ = value;
  }

  get availableEmails(): EmailOption[] {
    return [
      {
        email: this.companyToUpdate.invitationEmail,
        option: CompanyEmailOptions.INVITATION,
        hint: 'Correo de empresa',
        icon: 'mdi-office-building',
      },
      {
        email: this.companyToUpdate.user?.email,
        option: CompanyEmailOptions.USER,
        hint: 'Correo de responsable',
        icon: 'mdi-card-account-details',
      },
    ];
  }

  perform() {
    this.avatarChangeRef?.perform();

    this.setCompanyToUpdate(this.companyToUpdate);

    // Send email to use
    const updateEmail = { update: this.updateEmail, useEmail: this.currentEmailOption.option };
    console.log(updateEmail);
    this.setUpdateEmail(updateEmail);
  }

  validate() {
    const formValidation = this.formRef.validate();

    if (formValidation !== undefined && formValidation !== null) {
      this.isValid = formValidation;
    }

    return this.isValid;
  }

  resetValidation() {
    this.formRef.resetValidation();
  }
  reset() {
    this.formRef.reset();
  }
}
</script>

<style lang="scss" scoped>
.inline {
  display: inline-block;
}
</style>
