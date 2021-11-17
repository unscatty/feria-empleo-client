import { buildFormData } from '@/helpers/form';
import { IJobPost } from '@/models/job-post/job-post.interface';
import axios from 'axios';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

export interface IFilters {
  type?: string;
  jobMode?: string;
  jobType?: string;
  experience?: string;
  search?: string;
  companyId?: string;
  page?: number;
  limit?: number;
  salaryMinGte?: number;
  salaryMaxLte?: number;
}
export interface JobPostState {
  jobPositions: any[];
  loadingJobPositions: boolean;
  jobPositionsGlobalSearch: any[];

  jobsPaginationData: any;

  skillSets: any[];
  jobPostFilters?: IFilters;
}

@Module({ namespaced: true })
class JobPost extends VuexModule<JobPostState> {
  public jobPositions: IJobPost[] = [];
  public loadingJobPositions = false;
  public jobPositionsGlobalSearch: any[] = [];
  public jobPostFilters: IFilters = {
    page: 1,
    limit: 10,
  };
  public jobsPaginationData: any = { totalItems: 0 };
  public skillSets: any[] = [];

  // Mutations
  @Mutation
  public setJobPosts(jobPositions: any[]): void {
    this.jobPositions = jobPositions;
  }

  @Mutation
  public addJobPosts(jobPositions: any[]): void {
    const newArr = [...this.jobPositions, ...jobPositions];
    // remover duplicados
    this.jobPositions = newArr.filter(
      (v, index, arr) => arr.findIndex((t) => t.id === v.id) === index
    );
  }

  @Mutation
  public setLoadingJobPosts(loading: boolean): void {
    this.loadingJobPositions = loading;
  }

  @Mutation
  public setJobPostsGlobalSearch(jobPositions: any[]): void {
    this.jobPositionsGlobalSearch = jobPositions;
  }

  @Mutation
  public setjobsPaginationData(data: any): void {
    this.jobsPaginationData = data;
  }

  @Mutation
  public updateFilters(filters: IFilters): void {
    this.jobPostFilters = Object.assign({}, this.jobPostFilters, filters);
  }

  @Mutation
  public addUpdateJobPost(newJobPost: IJobPost): void {
    const jobFoundId = this.jobPositions.findIndex((j) => j.id === newJobPost.id);
    if (jobFoundId > -1) {
      const currentJobPost = this.jobPositions[jobFoundId];
      const newValue = Object.assign({}, currentJobPost, newJobPost);
      this.jobPositions = [
        ...this.jobPositions.slice(0, jobFoundId),
        newValue,
        ...this.jobPositions.slice(jobFoundId + 1),
      ];
    } else {
      this.jobPositions.unshift(newJobPost);
    }
  }

  @Mutation
  public removeJobPost(id: number): void {
    this.jobPositions = this.jobPositions.filter((j) => j.id !== id);
  }

  @Mutation
  public setSkillSets(skillSets: any[]): void {
    this.skillSets = skillSets;
  }

  // Actions
  @Action
  async findAllJobPosts() {
    try {
      this.context.commit('setLoadingJobPosts', true);
      const res = await axios.get('job-posts', {
        params: this.context.state.jobPostFilters,
      });
      this.context.commit('setJobPosts', res.data.items);
      this.context.commit('setjobsPaginationData', res.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      this.context.commit('setLoadingJobPosts', false);
    }
  }

  @Action
  async fetchMoreJobPosts() {
    try {
      this.context.commit('setLoadingJobPosts', true);
      const res = await axios.get('job-posts', {
        params: this.context.state.jobPostFilters,
      });
      this.context.commit('addJobPosts', res.data.items);
      this.context.commit('setjobsPaginationData', res.data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      this.context.commit('setLoadingJobPosts', false);
    }
  }

  @Action
  async jobPostsGlobalSearch(search: string) {
    try {
      const res = await axios.get(`job-posts/global-search/${search}`);
      this.context.commit('setJobPostsGlobalSearch', res.data);
    } catch (error) {
      console.log(error);
    }
  }

  @Action
  async findAllSkillSets() {
    try {
      const res = await axios.get('skill-set');
      this.context.commit('setSkillSets', res.data);
    } catch (error) {
      console.log(error);
    }
  }

  @Action
  async createJobPost(data: IJobPost) {
    try {
      const formData = new FormData();
      buildFormData(formData, data);
      await axios.post('job-posts', formData);
      this.context.dispatch('Ui/showToast', { text: 'Vacante creada con éxito' }, { root: true });
      this.context.dispatch('findAllJobPosts');
      return true;
    } catch (error) {
      this.context.dispatch(
        'Ui/showToast',
        { text: 'Ocurrio un error al crear la vacante', color: 'error' },
        { root: true }
      );
      console.log(error);
      return false;
    }
  }

  @Action
  async updateJobPost({ id, data }: any) {
    try {
      const formData = new FormData();
      buildFormData(formData, data);
      const res = await axios.put(`job-posts/${id}`, formData);
      this.context.dispatch(
        'Ui/showToast',
        { text: 'Vacante actualizada con éxito' },
        { root: true }
      );
      this.context.commit('addUpdateJobPost', res.data);
      return true;
    } catch (error) {
      this.context.dispatch(
        'Ui/showToast',
        { text: 'Ocurrio un error al actualizar la vacante', color: 'error' },
        { root: true }
      );
      console.log(error);
      return false;
    }
  }

  @Action
  async deleteJobPost(id: number) {
    try {
      const res = await axios.delete(`job-posts/${id}`);
      this.context.dispatch(
        'Ui/showToast',
        { text: 'Vacante eliminada con éxito' },
        { root: true }
      );
      this.context.commit('removeJobPost', res.data?.id);
    } catch (error) {
      this.context.dispatch(
        'Ui/showToast',
        { text: 'Ocurrio un error al eliminar la vacante', color: 'error' },
        { root: true }
      );
      console.log(error);
    }
  }
}
export default JobPost;
export const JOBPOST_STORE_NAME = JobPost.name;
