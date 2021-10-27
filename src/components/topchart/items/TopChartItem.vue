<template>
  <div class="mt-2">
    <div class="job-details">
      <h3>{{ position.jobTitle }}</h3>
      <span>{{ formatMoney(position.salaryMax) }} - {{ formatMoney(position.salaryMin) }}</span>
    </div>
    <div class="mt-2">
      <p>{{ truncate(position.description, 150) }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { formatMoney } from '@/utils/format-money';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { truncate } from '@/helpers/text';

@Component({})
export default class TopChartItem extends Vue {
  @Prop({ type: Object, required: true }) readonly position: any;
  truncate = truncate;
  public formatMoney(value: number) {
    return formatMoney(value);
  }
}
</script>

<style scoped>
@import './topChartItem.css';
</style>
