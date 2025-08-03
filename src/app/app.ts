import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { UserAvatar } from './user-avatar/user-avatar';
// import { VoteButton } from './vote-button/vote-button';
// import { CommentActions } from './comment-actions/comment-actions';
// import { CommentForm, commentSubmitData } from './comment-form/comment-form';
// import { CommentBox, CommentEvent } from './comment-box/comment-box';
import { CommentSection } from './comment-section/comment-section';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommentSection],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('comment-interactive');
}
