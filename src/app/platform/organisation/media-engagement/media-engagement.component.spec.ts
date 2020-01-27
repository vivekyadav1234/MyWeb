import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaEngagementComponent } from './media-engagement.component';

describe('MediaEngagementComponent', () => {
  let component: MediaEngagementComponent;
  let fixture: ComponentFixture<MediaEngagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaEngagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaEngagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
