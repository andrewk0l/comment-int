import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentModel } from '../models/comment.model';
import { UserModel } from '../models/user.model';
import { UserAvatar } from '../user-avatar/user-avatar';
import { VoteButton } from '../vote-button/vote-button';
import { CommentActions } from '../comment-actions/comment-actions';
import { CommentForm, commentSubmitData } from '../comment-form/comment-form';
import { FormsModule } from '@angular/forms';

export interface CommentEvent {
  type: 'upvote' | 'downvote' | 'reply' | 'edit' | 'delete';
  commentId: number;
  data?: any;
  replyingTo?: string;
}

@Component({
  selector: 'app-comment-box',
  imports: [
    FormsModule,
    CommonModule,
    UserAvatar,
    VoteButton,
    CommentActions,
    CommentForm,
  ],
  templateUrl: './comment-box.html',
  styleUrl: './comment-box.css',
})
export class CommentBox {
  @Input({ required: true }) comment!: CommentModel;
  @Input({ required: true }) currentUser!: UserModel;
  @Input() editingCommentId: number | null = null;

  get isEditing(): boolean {
    return this.editingCommentId === this.comment.id;
  }

  ngOnInit() {
    console.log(`CommentBox ${this.comment.id} - isEditing:`, this.isEditing);
  }

  ngOnChanges() {
    console.log(
      `CommentBox ${this.comment.id} - isEditing changed to:`,
      this.isEditing
    );
  }

  @Output() commentEvent = new EventEmitter<CommentEvent>();
  @Output() editUpdate = new EventEmitter<{
    commentId: number;
    content: string;
  }>();
  @Output() editCancel = new EventEmitter<void>();

  showReplyForm = false;
  editContent = '';

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isEditing) {
      const clickedInside = this.elementRef.nativeElement.contains(
        event.target
      );
      if (!clickedInside) {
        this.editCancel.emit();
      }
    }
  }

  onUpvote(commentId: number) {
    this.commentEvent.emit({ type: 'upvote', commentId });
  }

  onDownvote(commentId: number) {
    this.commentEvent.emit({ type: 'downvote', commentId });
  }

  // Action events
  onReply(commentId: number) {
    this.showReplyForm = true;
  }

  onEditStart() {
    this.editContent = this.comment.content;
  }

  onEditUpdate() {
    if (this.editContent.trim()) {
      this.editUpdate.emit({
        commentId: this.comment.id,
        content: this.editContent,
      });
    }
  }

  onEdit(commentId: number) {
    this.commentEvent.emit({ type: 'edit', commentId });
  }

  onDelete(commentId: number) {
    this.commentEvent.emit({ type: 'delete', commentId });
  }

  // Reply form events
  onReplySubmit(data: commentSubmitData) {
    console.log('onReplySubmit called for comment:', this.comment.id, data);

    if (data instanceof Event) {
      console.log('Ignoring raw event');
      return;
    }
    this.commentEvent.emit({
      type: 'reply',
      commentId: this.comment.id,
      data,
    });
    this.showReplyForm = false;
  }

  // Nested comment events (from child CommentBox components)
  onNestedCommentEvent(event: CommentEvent) {
    // Pass the event up to parent
    console.log(
      'onNestedCommentEvent called for comment:',
      this.comment.id,
      event
    );
    this.commentEvent.emit(event);
  }
}
