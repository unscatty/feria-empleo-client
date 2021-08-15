<template>
  <div class="job-info clickable">
    <div class="job-details">
      <h3>{{ position.jobTitle }}</h3>
      <p>{{ position.description }}</p>
    </div>
    <div class="hr-rate">
      <span>{{ formatMoney(position.salaryMax) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { formatMoney } from '@/utils/format-money';
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})

export default class TopChartItem extends Vue {
    @Prop({ type: Object, required: true} ) readonly position: any;

    public formatMoney(value: number) {
        return formatMoney(value);
    }
}
</script>

<style scoped>
@import "./topChartItem.css";
</style>