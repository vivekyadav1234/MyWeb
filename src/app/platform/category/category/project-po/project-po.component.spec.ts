import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPoComponent } from './project-po.component';

describe('ProjectPoComponent', () => {
  let component: ProjectPoComponent;
  let fixture: ComponentFixture<ProjectPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
