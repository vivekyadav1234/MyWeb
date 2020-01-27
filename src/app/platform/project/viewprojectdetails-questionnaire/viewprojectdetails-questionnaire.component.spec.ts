import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewprojectdetailsQuestionnaireComponent } from './viewprojectdetails-questionnaire.component';

describe('ViewprojectdetailsQuestionnaireComponent', () => {
  let component: ViewprojectdetailsQuestionnaireComponent;
  let fixture: ComponentFixture<ViewprojectdetailsQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewprojectdetailsQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewprojectdetailsQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
