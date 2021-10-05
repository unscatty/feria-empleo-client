<template>
  <div class="col-lg-3 col-md-4 col-sm-6">
    <div class="company_profile_info">
      <div class="company-up-info">
        <img :src="company.image.imageURL" alt="" />
        <h3>{{ company.name }}</h3>
        <h4>{{ company.description }}</h4>
      </div>
      <router-link
        :to="{ path: '/showCompany/' + company.id}"
        title=""
        class="view-more-pro"
        >Ver vacantes</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class CompanyCard extends Vue {
    @Prop({ type: Object, required: true}) readonly company: any;

    constructor() { super(); }
}
</script>

<style scoped>
@import "./companies-card.css";
</style>