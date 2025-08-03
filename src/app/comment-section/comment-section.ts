import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentModel } from '../models/comment.model';
import { UserModel } from '../models/user.model';
import { CommentBox, CommentEvent } from '../comment-box/comment-box';
import { CommentForm, commentSubmitData } from '../comment-form/comment-form';
import { Deletemodal } from '../deletemodal/deletemodal';
import { Comment } from '../comment';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-comment-section',
  imports: [CommonModule, CommentBox, CommentForm, Deletemodal],
  templateUrl: './comment-section.html',
  styleUrl: './comment-section.css',
})
export class CommentSection implements OnInit {
  currentUser!: UserModel;
  comments: CommentModel[] = [];
  private nextId = 1;
  loading = true;
  error: string | null = null;
  showDeleteModal = false;
  deleteCommentId: number | null = null;
  editingCommentId: number | null = null;
  originalContent: string = '';

  constructor(
    private commentService: Comment,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCommentData();
  }

  public loadCommentData() {
    this.commentService.loadComments().subscribe({
      next: (data) => {
        console.log('Data received:', data);
        this.currentUser = data.currentUser;
        this.comments = data.comments;
        this.nextId = this.getMaxId(data.comments) + 1;
        this.loading = false;
        console.log('Loading set to false, comments:', this.comments);
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.error = 'Failed to load comments. Please try again.';
        this.loading = false;
      },
    });
  }

  private getMaxId(comments: CommentModel[]): number {
    let maxId = 0;
    for (const comment of comments) {
      if (comment.id > maxId) maxId = comment.id;
      if (comment.replies) {
        const replyMaxId = this.getMaxId(comment.replies);
        if (replyMaxId > maxId) maxId = replyMaxId;
      }
    }
    return maxId;
  }

  onCommentEvent(event: CommentEvent) {
    switch (event.type) {
      case 'upvote':
        this.handleUpvote(event.commentId);
        break;
      case 'downvote':
        this.handleDownvote(event.commentId);
        break;
      case 'reply':
        this.handleReply(event.commentId, event.data);
        break;
      case 'edit':
        this.startEdit(event.commentId);
        console.log('Edit - will implement later', event);
        break;
      case 'delete':
        this.showDeleteConfirmation(event.commentId);
        console.log('Delete - will implement later', event);
        break;
    }
  }

  private startEdit(commentId: number) {
    console.log('startEdit called with commentId:', commentId);
    const comment = this.findCommentById(commentId);
    console.log('Found comment:', comment);
    if (comment) {
      this.editingCommentId = commentId;
      this.originalContent = comment.content;
      console.log('Set editingCommentId to:', this.editingCommentId);
    }
  }

  onEditUpdate(commentId: number, newContent: string) {
    const comment = this.findCommentById(commentId);
    if (comment && newContent.trim()) {
      comment.content = newContent.trim();
      this.cancelEdit();
    }
  }

  onEditCancel() {
    // Revert content if needed
    if (this.editingCommentId !== null) {
      const comment = this.findCommentById(this.editingCommentId);
      if (comment) {
        comment.content = this.originalContent;
      }
    }
    this.cancelEdit();
  }

  private cancelEdit() {
    this.editingCommentId = null;
    this.originalContent = '';
  }

  // Helper method to check if a comment is being edited
  isCommentEditing(commentId: number): boolean {
    const result = this.editingCommentId === commentId;
    console.log(
      `isCommentEditing(${commentId}):`,
      result,
      'editingCommentId:',
      this.editingCommentId
    );
    return result;
  }

  onNewComment(data: commentSubmitData) {
    if (data instanceof Event) {
      console.log('Ignoring raw event');
      return;
    }
    const newComment: CommentModel = {
      id: this.nextId++,
      content: data.content,
      createdAt: 'now',
      score: 0,
      user: this.currentUser,
      replies: [],
    };

    this.comments.push(newComment);
  }

  private showDeleteConfirmation(commentId: number) {
    this.deleteCommentId = commentId;
    this.showDeleteModal = true;
  }

  onDeleteConfirm() {
    if (this.deleteCommentId !== null) {
      this.deleteComment(this.deleteCommentId);
    }
    this.hideDeleteModal();
  }

  onDeleteCancel() {
    this.hideDeleteModal();
  }

  private hideDeleteModal() {
    this.showDeleteModal = false;
    this.deleteCommentId = null;
  }

  private deleteComment(commentId: number) {
    // Remove from main comments array
    this.comments = this.comments.filter((comment) => comment.id !== commentId);

    // Remove from nested replies (in case it's a reply being deleted)
    this.removeFromReplies(this.comments, commentId);
  }

  private removeFromReplies(comments: CommentModel[], commentId: number) {
    for (const comment of comments) {
      if (comment.replies) {
        comment.replies = comment.replies.filter(
          (reply) => reply.id !== commentId
        );
        // Recursively check nested replies
        this.removeFromReplies(comment.replies, commentId);
      }
    }
  }

  private handleUpvote(commentId: number) {
    const comment = this.findCommentById(commentId);
    if (comment) {
      comment.score++;
    }
  }

  private handleDownvote(commentId: number) {
    const comment = this.findCommentById(commentId);
    if (comment) {
      comment.score--;
    }
  }

  private handleReply(parentId: number, replyData: commentSubmitData) {
    const parentComment = this.findCommentById(parentId);
    if (parentComment && replyData) {
      const newReply: CommentModel = {
        id: this.nextId++,
        content: replyData.content,
        createdAt: 'now',
        score: 0,
        replyingTo: replyData.replyingTo,
        user: this.currentUser,
        replies: [],
      };

      if (!parentComment.replies) {
        parentComment.replies = [];
      }
      parentComment.replies.push(newReply);
    }
  }

  private findCommentById(id: number): CommentModel | null {
    return this.findCommentInArray(this.comments, id);
  }

  private findCommentInArray(
    comments: CommentModel[],
    id: number
  ): CommentModel | null {
    for (const comment of comments) {
      if (comment.id === id) {
        return comment;
      }
      if (comment.replies) {
        const found = this.findCommentInArray(comment.replies, id);
        if (found) return found;
      }
    }
    return null;
  }
}
