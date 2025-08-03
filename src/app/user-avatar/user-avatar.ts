import { Component, Input } from '@angular/core';
import { UserModel } from '../models/user.model';
import { CommentModel } from '../models/comment.model';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.css',
})
export class UserAvatar {
  @Input({ required: true }) user!: UserModel;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() className: string = '';
}
