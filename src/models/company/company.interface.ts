import { IJobPost } from '../job-post/job-post.interface';

export interface ICompany {
  id?: number;
  name: string;
  invitationEmail: string;
  activeEmail?: string;
  description?: string;
  videoUrl?: string;
  staff?: string;
  isActive?: boolean;
  imageURL?: string;

  jopPosts?: IJobPost[];
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
