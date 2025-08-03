import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserModel } from '../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-actions',
  standalone: true,
  templateUrl: './comment-actions.html',
  imports: [CommonModule],
  styleUrl: './comment-actions.css',
})
export class CommentActions {
  @Input({ required: true }) commentId!: number;
  @Input({ required: true }) commentUser!: UserModel;
  @Input({ required: true }) currentUser!: UserModel;

  @Output() reply = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  get isCurrentUserComment(): boolean {
    return this.commentUser.username === this.currentUser.username;
  }

  get canReply(): boolean {
    return !this.isCurrentUserComment;
  }

  get canEdit(): boolean {
    return this.isCurrentUserComment;
  }

  get canDelete(): boolean {
    return this.isCurrentUserComment;
  }

  onReply() {
    this.reply.emit(this.commentId);
  }

  onEdit() {
    this.edit.emit(this.commentId);
  }

  onDelete() {
    this.delete.emit(this.commentId);
  }
}
