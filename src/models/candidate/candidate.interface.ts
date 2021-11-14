import { IUser } from '../user/user.interface';
import { IJobPost } from '../job-post/job-post.interface';

export interface ICandidate {
  id: number;
  name: string;
  lastname: string;
  currentSalary: number;
  resume: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  user: IUser;
  jobPosts: IJobPost[];
  // TODO: define these field types
  // experienceDetails: ExperienceDetail[];
  // educationDetails: EducationDetail[];
  // skillSets: SkillSet[];
}
