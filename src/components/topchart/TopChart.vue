<template>
  <div class="mt-3">
    <v-card class="widget widget-jobs">
      <v-card-title>
        <h3><slot></slot></h3>
      </v-card-title>
    </v-card>

    <v-divider></v-divider>
    <v-card
      v-for="position in component.topPositions"
      :key="position.id"
      class="mt-3"
      @click="goToPositions(position.id)"
    >
      <v-divider></v-divider>
      <v-card-text>
        <TopChartItem :position="position" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { TopChartComponent } from './topchart.component';
import TopChartItem from './items/TopChartItem.vue';

@Component({
  components: {
    TopChartItem,
  },
})
export default class TopChart extends Vue {
  @Prop({ required: true, type: String }) readonly endpoint: any;

  public component: TopChartComponent;

  constructor() {
    super();
    this.component = new TopChartComponent(this.endpoint);
  }

  public goToPositions(companyId: number) {
    this.component.goToPosition(this, companyId);
  }
  created() {
    this.component.getPositions();
  }
}
</script>
