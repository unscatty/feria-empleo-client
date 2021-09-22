import { buildFormData } from '@/helpers/form';
import { IJobPost } from '@/models/job-post/job-post.interface';
import axios from 'axios';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

export interface IFilters {
  type?: string;
  modality?: string;
  experience?: string;
  employerId?: string;
  page?: number;
  limit?: number;
}
export interface JobPostState {
  jobPositions: any[];
  jobsPaginationData: any;

  skillSets: any[];
  jobPostFilters?: IFilters;
}

@Module({ namespaced: true })
class JobPost extends VuexModule<JobPostState> {
  public jobPositions: IJobPost[] = [];
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
      const res = await axios.get('job-posts', {
        params: this.context.state.jobPostFilters,
      });
      this.context.commit('setJobPosts', res.data.items);
      this.context.commit('setjobsPaginationData', res.data.meta);
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
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  }
}
export default JobPost;
export const JOBPOST_STORE_NAME = JobPost.name;
