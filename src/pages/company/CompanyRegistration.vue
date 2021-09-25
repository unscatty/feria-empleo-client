<template>
  <v-container>
    <template v-if="form">
      Haz sido registrado como responsable de la empresa {{ form.name }}
      <v-form ref="form" lazy-validation>
        <v-text-field
          v-model="form.name"
          :rules="[rules.required]"
          label="Nombre de la empresa"
          required
        ></v-text-field>

        <v-text-field
          v-model="form.invitationEmail"
          :rules="[rules.required, rules.email]"
          label="Email"
          required
          disabled
        ></v-text-field>
        <v-label class="mb-3">Requerimientos</v-label>
        <Wysiwyg v-model="form.requirements"></Wysiwyg>
      </v-form>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { rules } from "@/helpers/form";
import { ICompany } from "@/models/company/company.interface";
import { VForm } from "@/models/form";
import { CompanyService } from "@/services/company.service";
import { Component, Ref, Vue } from "vue-property-decorator";
import Wysiwyg from "@/components/general/wysiwyg.vue";
import { lazyInject } from "@/app.container";
import AuthService from "@/auth/auth.service";

@Component({ components: { Wysiwyg } })
export default class CompanyRegistration extends Vue {
  form: ICompany = null;

  @lazyInject(AuthService)
  authservice: AuthService;

  // Refs
  @Ref("form") readonly formRef!: VForm;

  @lazyInject(CompanyService)
  protected companyService: CompanyService;

  get rules() {
    return rules;
  }

  async created() {
    // Register company
    const state = this.authservice.getState();
    // FIXME: fix when endpoint updated
    const response = (await this.companyService.register(state)) as any;
    this.form = response.company;
  }
}
</script>

<style scoped>
</style>