<template>
  <div class="mt-2">
    <div class="job-details">
      <h3>{{ position.jobTitle }}</h3>
      <span>{{ formatMoney(position.salaryMax) }} - {{ formatMoney(position.salaryMin) }}</span>
    </div>
    <div class="mt-2">
      <p>{{ position.description }}</p>
    </div>
    <!-- <div class="text-center">
      <v-btn elevation="2"> Ver vacante</v-btn>
    </div> -->
  </div>
</template>

<script lang="ts">
import { formatMoney } from '@/utils/format-money';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class TopChartItem extends Vue {
  @Prop({ type: Object, required: true }) readonly position: any;

  public formatMoney(value: number) {
    return formatMoney(value);
  }
}
</script>

<style scoped>
@import './topChartItem.css';
</style>
