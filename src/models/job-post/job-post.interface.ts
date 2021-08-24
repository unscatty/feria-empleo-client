export enum JobPostType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
}

export enum JobPostMode {
  OFFICE = 'office',
  HYBRID = 'hybrid',
  HOME_OFFICE = 'home_office',
}

export interface IJobPost {
  id?: number;
  isActive?: boolean;
  jobTitle?: string;
  description?: string;
  requirements?: string;
  experience?: string;
  imageUrl?: string;
  jobType?: JobPostType;
  jobMode?: JobPostMode;
  salaryMin?: number;
  salaryMax?: number;
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
  /*   company: Company;
  candidates: Candidate[];
  tags: SkillSet[]; */
}
