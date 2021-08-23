import { IJobPost } from '../job-post/job-post.interface';
import { IUser } from '../user/user.interface';

// Type expected from backend
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

  // Relationships
  user?: IUser;
  jopPosts?: IJobPost[];
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
