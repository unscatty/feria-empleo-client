import { jobPostModes, jobPostTypes } from '@/constants/job-post';
import { IJobPost } from '@/models/job-post/job-post.interface';

export class AdminVacantesComponent {
  currentPosition: IJobPost = null;
  dialog = false;
  loadingTable = false;
  deleteDialog = false;
  updating = false;
  loading = false;
  headers = [
    {
      text: 'Imagen',
      align: 'center',
      sortable: false,
      value: 'image',
    },
    {
      text: 'Titulo',
      align: 'center',
      sortable: false,
      value: 'jobTitle',
    },
    {
      text: 'Salario',
      align: 'center',
      sortable: false,
      value: 'salary',
    },
    {
      text: 'Jornada',
      align: 'center',
      sortable: false,
      value: 'jobType',
    },
    {
      text: 'Tipo de trabajo',
      align: 'center',
      sortable: false,
      value: 'jobMode',
    },
    {
      text: 'Acciones',
      align: 'center',
      sortable: false,
      value: 'actions',
      class: 'text-center',
    },
  ];
  jobPostTypes = jobPostTypes;
  jobPostModes = jobPostModes;
  options = {};

  parseJobType(jobType: string) {
    const typeFound = this.jobPostTypes.find((j) => j.value === jobType);
    if (typeFound) {
      return typeFound.text;
    }
    return '';
  }

  parseJobMode(jobMode: string) {
    const modeFound = this.jobPostModes.find((j) => j.value === jobMode);
    if (modeFound) {
      return modeFound.text;
    }
    return '';
  }

  editPosition(jobPost: any) {
    this.currentPosition = jobPost;
    this.dialog = true;
    this.updating = true;
  }
  openDeleteDialog(jobPost: any) {
    this.currentPosition = jobPost;
    this.deleteDialog = true;
  }

  seeAppliedCandidates(jobPost: any) {
  }
}
