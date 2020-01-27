import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListDesignerComponent } from './project-list-designer.component';

describe('ProjectListDesignerComponent', () => {
  let component: ProjectListDesignerComponent;
  let fixture: ComponentFixture<ProjectListDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectListDesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
