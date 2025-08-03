import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentActions } from './comment-actions';

describe('CommentActions', () => {
  let component: CommentActions;
  let fixture: ComponentFixture<CommentActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
