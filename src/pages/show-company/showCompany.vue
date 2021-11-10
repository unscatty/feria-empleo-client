<template>
  <v-container>
    <v-row> </v-row>
    <v-text-field v-model="search" label="Buscar" :loading="loadingSearch"></v-text-field>

    <v-row v-if="jobPositions.length !== 0">
      <v-col md="6" cols="12" v-for="position in jobPositions" :key="position.id">
        <Positions class="mt-5" :position="position" />
      </v-col>
      <v-col class="text-center">
        <infinite-loading @infinite="infiniteHandler">
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col style="height:300px" cols="12" class="d-flex justify-center align-center">
        <h2>
          Sin vacantes para mostrar
        </h2>
      </v-col>
    </v-row>
    <!--   <div class="col-lg-6">
      <div class="posts-section" v-if="jobPositions.length !== 0">
        <div class="post-bar" >
        </div>

      </div>

      <div v-if="jobPositions.length === 0">
        <div class="no-positions">
          <h1>Sin vacantes para mostrar</h1>
        </div>
      </div>
    </div> -->
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Positions from '../../components/positions/Positions.vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { IJobPost } from '@/models/job-post/job-post.interface';
import { IFilters } from '@/store/modules/job-post';
import InfiniteLoading from 'vue-infinite-loading';
import { Watch } from 'vue-property-decorator';

const jobPost = namespace('JobPost');

@Component({
  components: {
    Positions,
    InfiniteLoading,
  },
})
export default class ShowCompany extends Vue {
  search: string = null;
  delayTimerSearch: any = null;
  loadingSearch = false;
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
    if (!this.$route.params) {
      this.$router.replace('/');
    }

    this.updateFilters({ companyId: this.$route.params.id });
    this.findAllJobPosts();
  }

  destroyed() {
    this.updateFilters({ page: 1 });
  }

  @Watch('search')
  searchChange(val: string) {
    this.loadingSearch = true;
    clearTimeout(this.delayTimerSearch);
    this.delayTimerSearch = setTimeout(async () => {
      this.updateFilters({ search: val });
      this.findAllJobPosts();

      this.loadingSearch = false;
    }, 400);
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
@import './show-company.css';
</style>
