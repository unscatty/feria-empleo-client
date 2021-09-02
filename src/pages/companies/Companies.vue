<template>
  <div>
    <section class="companies-info">
      <div class="container">
        <div class="company-title">
          <h3>Empresas</h3>
        </div>
        <!--company-title end-->
        <div class="companies-list">
          <div class="row">
            <CompanyCard
              v-for="company in vm.companies"
              :key="company.id"
              :company="company"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

import { CompaniesComponent } from './companies.component';
import CompanyCard from './CompanyCards/CompanyCard.vue';

@Component({
    components: {
        CompanyCard
    }
})
export default class CompaniesList extends Vue {

    public vm = new Vue({
      data: {
        companies: []
      }
    });
    public companyComponent: CompaniesComponent = new CompaniesComponent();
    constructor() {
        super();
    }

    async created() {
        await this.companyComponent.getCompanies();
        this.vm.companies = this.companyComponent.companies;
    }
}
</script>

<style scoped>
@import "./companies.css";
</style>