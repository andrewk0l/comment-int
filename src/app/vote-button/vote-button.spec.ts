import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteButton } from './vote-button';

describe('VoteButton', () => {
  let component: VoteButton;
  let fixture: ComponentFixture<VoteButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
