<template>
  <div>
    <v-container>
      <div class="main-section-data">
        <v-row class="row">
          <v-col v-if="loadingJobPositions" md="8" cols="12">
            <v-skeleton-loader
              v-for="(item, index) in [0, 1]"
              :key="index"
              class="mt-4"
              type="card-avatar, article, actions"
            ></v-skeleton-loader>
          </v-col>
          <v-col v-else-if="jobPositions.length > 0" md="8" cols="12">
            <Positions
              v-for="(position, index) in jobPositions"
              :key="position.id"
              :position="position"
              class="position"
              :class="index !== 0 ? 'mt-5' : ''"
            />
            <infinite-loading @infinite="infiniteHandler">
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </v-col>
          <v-col v-else md="8" cols="12" class="d-flex justify-center align-center">
            <h2>Sin vacantes para mostrar</h2>
          </v-col>
          <v-col md="4" cols="12">
            <TopChart :endpoint="$router.resolve({ name: 'TopViewed' }).href">
              Más vistos
            </TopChart>
            <TopChart :endpoint="$router.resolve({ name: 'TopApplied' }).href">
              Más aplicadas
            </TopChart>
            <TopChart :endpoint="$router.resolve({ name: 'TopNew' }).href">
              Más Recientes
            </TopChart>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import InfiniteLoading from 'vue-infinite-loading';

import { Component, Vue } from 'vue-property-decorator';

import Filters from '../../components/filters/Filters.vue';
import Positions from '../../components/positions/Positions.vue';
import TopChart from '../../components/topchart/TopChart.vue';
import { namespace } from 'vuex-class';
import { IJobPost } from '@/models/job-post/job-post.interface';
import { IFilters } from '@/store/modules/job-post';
const jobPost = namespace('JobPost');

@Component({
  components: {
    Filters,
    Positions,
    TopChart,
    InfiniteLoading,
  },
})
export default class Home extends Vue {
  changeToolbar = false;
  fixedToobar = false;

  // Store
  @jobPost.State
  public jobPositions!: IJobPost[];

  @jobPost.State
  public loadingJobPositions!: boolean;

  @jobPost.State
  public jobsPaginationData!: any;

  @jobPost.State
  public jobPostFilters!: IFilters;

  @jobPost.Mutation
  public updateFilters!: (filters: IFilters) => void;

  @jobPost.Action
  public findAllJobPosts!: () => void;

  @jobPost.Action
  public fetchMoreJobPosts!: () => void;

  created() {
    this.findAllJobPosts();
  }

  destroyed() {
    this.updateFilters({ page: 1 });
  }

  infiniteHandler($state: any) {
    if (this.jobPostFilters.page === this.jobsPaginationData.totalPages) {
      $state.complete();
    } else {
      setTimeout(() => {
        this.updateFilters({ page: this.jobPostFilters.page + 1 });
        this.fetchMoreJobPosts();
        $state.loaded();
      }, 500);
    }
  }
}
</script>

<style scoped>
@import './home.css';
</style>
