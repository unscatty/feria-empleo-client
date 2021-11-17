<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :to="{ path: '/showCompany/' + company.id }"
      :elevation="hover ? 10 : 2"
      :class="{ 'on-hover': hover }"
      class="col-lg-3 col-md-4 col-sm-6"
    >
      <v-img height="250" :src="company.imageURL || require('@/assets/no-image.png')"></v-img>
      <v-card-title>{{ company.name }}</v-card-title>
      <v-card-text>
        <div>{{ truncate(company.description || "", 100) }}</div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { truncate } from '@/helpers/text';

@Component({})
export default class CompanyCard extends Vue {
  @Prop({ type: Object, required: true }) readonly company: any;
  truncate = truncate;
  constructor() {
    super();
  }
}
</script>

<style scoped>
@import './companies-card.css';
</style>
