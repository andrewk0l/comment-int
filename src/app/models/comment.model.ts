import { UserModel } from './user.model';

export interface CommentModel {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo?: string;
  user: UserModel;
  replies?: CommentModel[];
}
