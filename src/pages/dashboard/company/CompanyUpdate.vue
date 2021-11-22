<template>
  <div>
    <v-container v-if="companyToUpdate" class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="12" md="12">
          <p class="text-md-left text-sm-center text-h4 text-md-h4 text-sm-h5 mt-2">
            Actualizar datos
          </p>

          <company-update-form
            :next-location="nextLocation"
            :cancel-location="undefined"
          ></company-update-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import ICompany from '@/models/company/company.interface';
import CompanyStore, { COMPANY_STORE_NAME } from '@/store/modules/company';
import { Component, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { namespace } from 'vuex-class';
import CompanyUpdateForm from '@/components/companies/CompanyUpdateForm.vue';

const companyStore = namespace(COMPANY_STORE_NAME);

@Component({ components: { CompanyUpdateForm } })
export default class CompanyUpdate extends Vue {
  nextLocation: RawLocation = { name: 'dashboard' };

  @companyStore.Getter('companyToUpdate')
  readonly companyToUpdate: ICompany;

  @companyStore.Action('setCompany')
  setCompany: typeof CompanyStore.prototype.setCompany;

  async created() {
    // // Load company info into store
    await this.setCompany();
  }
}
</script>

<style scoped></style>
