<template>
  <div class="widget widget-jobs">
    <div class="sd-title">
      <h3><slot></slot></h3>
    </div>
    <div class="jobs-list">
      <div
        v-for="position in component.topPositions"
        :key="position.id"
        @click="goToPositions(position.id)"
      >
        <TopChartItem :position="position" />
      </div>
    </div>
    <!--jobs-list end-->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { TopChartComponent } from './topchart.component';
import TopChartItem from './items/TopChartItem.vue';

@Component({
    components: {
        TopChartItem
    }
})
export default class TopChart extends Vue {
    @Prop({ required: true, type: String  }) readonly endpoint: any;

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