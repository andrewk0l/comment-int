import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { UserModel } from '../models/user.model';
import { UserAvatar } from '../user-avatar/user-avatar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface commentSubmitData {
  content: string;
  replyingTo?: string;
  parentId?: number;
}

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [UserAvatar, CommonModule, FormsModule],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.css',
})
export class CommentForm implements OnInit {
  @Input({ required: true }) currentUser!: UserModel;
  @Input() mode: 'new' | 'reply' = 'new';
  @Input() replyingTo?: string;
  @Input() parentId?: number;
  @Input() placeholder?: string;

  @Output() submit = new EventEmitter<commentSubmitData>();

  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;

  commentContent = '';

  ngOnInit() {
    if (this.mode === 'reply' && this.replyingTo) {
      this.commentContent = `@${this.replyingTo} `;
    }
  }

  ngAfterViewInit() {
    if (this.mode === 'reply') {
      this.textareaRef.nativeElement.focus();
      const length = this.commentContent.length;
      this.textareaRef.nativeElement.setSelectionRange(length, length);
    }
  }

  get effectivePlaceholder(): string {
    if (this.placeholder) return this.placeholder;
    return this.mode === 'reply' ? 'Write a reply...' : 'Add a comment...';
  }

  get submitButtonText(): string {
    return this.mode === 'reply' ? 'REPLY' : 'SEND';
  }

  get canSubmit(): boolean {
    return this.commentContent.trim().length > 0;
  }

  onSubmit() {
    console.log('CommentForm onSubmit() called');

    if (!this.canSubmit) return;

    const submitData: commentSubmitData = {
      content: this.commentContent.trim(),
    };

    if (this.mode === 'reply') {
      submitData.replyingTo = this.replyingTo;
      submitData.parentId = this.parentId;
    }
    console.log('About to emit:', submitData);
    this.submit.emit(submitData);
    this.resetForm();
  }

  private resetForm() {
    this.commentContent = '';
    if (this.mode === 'reply' && this.replyingTo) {
      this.commentContent = `@${this.replyingTo} `;
    }
  }

  onTextareaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
