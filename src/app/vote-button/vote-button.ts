import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vote-button',
  standalone: true,
  templateUrl: './vote-button.html',
  styleUrl: './vote-button.css',
})
export class VoteButton {
  @Input({ required: true }) score!: number;
  @Input({ required: true }) commentId!: number;

  @Output() upvote = new EventEmitter<number>();
  @Output() downvote = new EventEmitter<number>();

  onUpvote() {
    this.upvote.emit(this.commentId);
  }

  onDownvote() {
    this.downvote.emit(this.commentId);
  }
}
