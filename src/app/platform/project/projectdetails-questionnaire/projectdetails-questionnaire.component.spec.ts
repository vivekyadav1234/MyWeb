import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectdetailsQuestionnaireComponent } from './projectdetails-questionnaire.component';

describe('ProjectdetailsQuestionnaireComponent', () => {
  let component: ProjectdetailsQuestionnaireComponent;
  let fixture: ComponentFixture<ProjectdetailsQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectdetailsQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectdetailsQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
