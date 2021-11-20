<template>
  <v-container>
    <v-row no-gutters align="start">
      <v-col sm="12" md="6" cols="6" class="pa-2">
        <p class="text-md-h5 text-h6">Datos de la empresa</p>
        <v-form ref="companyForm" v-model="companyFormValid" lazy-validation>
          <v-textarea
            v-model="companyToUpdate.description"
            label="Descripción de la empresa"
            counter
            rows="4"
            no-resize
            :rules="[rules.required, rules.maxLength(255, companyToUpdate.description)]"
          >
          </v-textarea>
          <v-textarea
            v-model="companyToUpdate.staff"
            label="Trabajadores"
            counter
            rows="4"
            no-resize
            :rules="[rules.maxLengthUnrequired(255, companyToUpdate.staff)]"
          >
          </v-textarea>
        </v-form>
      </v-col>
      <v-col sm="12" md="6" cols="6" class="pa-2">
        <p class="text-md-h5 text-h6 mb-6">Datos del responsable</p>
        <v-form ref="userForm" v-model="userFormValid" lazy-validation>
          <v-text-field
            v-model="userToUpdate.name"
            :rules="[rules.required]"
            label="Nombre del responsable"
            required
          ></v-text-field>
          <v-text-field
            v-model="userToUpdate.lastname"
            :rules="[rules.required]"
            label="Apellido del responsable"
            required
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script script lang="ts">
import Actionable from '@/helpers/actionable.interface';
import { rules } from '@/helpers/form';
import ValidableForm from '@/helpers/validable-form.interface';
import ICompany from '@/models/company/company.interface';
import CompanyStore, { COMPANY_STORE_NAME } from '@/store/modules/company';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const companyStore = namespace(COMPANY_STORE_NAME);

@Component
export default class Step2 extends Vue implements Actionable, ValidableForm {
  isValid = false;

  isCompanyFormValid = false;
  isUserFormValid = false;

  get userFormValid() {
    return this.isUserFormValid;
  }

  set userFormValid(value) {
    this.isUserFormValid = value;

    this.updateIsValid();
  }

  get companyFormValid() {
    return this.isCompanyFormValid;
  }

  set companyFormValid(value) {
    this.isCompanyFormValid = value;

    this.updateIsValid();
  }

  updateIsValid() {
    this.isValid = this.isCompanyFormValid && this.isUserFormValid;
  }

  rules = rules;

  @Ref('companyForm')
  companyFormRef: ValidableForm;

  @Ref('userForm')
  userFormRef: ValidableForm;

  get userToUpdate() {
    return this.companyToUpdate?.user;
  }

  @companyStore.State('toUpdate')
  readonly companyToUpdate: ICompany;

  @companyStore.Action('setToUpdate')
  setCompanyToUpdate: typeof CompanyStore.prototype.setToUpdate;

  perform() {
    this.setCompanyToUpdate(this.companyToUpdate);
  }

  validate() {
    const userValidation = this.userFormRef?.validate();
    const companyValidation = this.companyFormRef?.validate();

    const formValidation = userValidation && companyValidation;

    if (formValidation !== undefined && formValidation !== null) {
      this.isValid = formValidation;
    }

    return this.isValid;
  }

  resetValidation() {
    this.companyFormRef.resetValidation();
    this.userFormRef.resetValidation();
  }

  reset() {
    this.companyFormRef.reset();
    this.userFormRef.reset();
  }
}
</script>

<style lang="scss" scoped></style>
