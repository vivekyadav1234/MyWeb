import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewlogsComponent } from './viewlogs.component';

describe('ViewlogsComponent', () => {
  let component: ViewlogsComponent;
  let fixture: ComponentFixture<ViewlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
