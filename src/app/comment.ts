import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentModel } from './models/comment.model';
import { UserModel } from './models/user.model';

export interface CommentData {
  currentUser: UserModel;
  comments: CommentModel[];
}

@Injectable({
  providedIn: 'root',
})
export class Comment {
  private readonly DATA_URL = 'assets/data/comments.json';

  constructor(private http: HttpClient) {}

  /**
   * Load all comment data from JSON file
   */
  loadComments(): Observable<CommentData> {
    return this.http.get<CommentData>(this.DATA_URL);
  }
}
