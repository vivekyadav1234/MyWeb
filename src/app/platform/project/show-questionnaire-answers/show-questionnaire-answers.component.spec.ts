import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowQuestionnaireAnswersComponent } from './show-questionnaire-answers.component';

describe('ShowQuestionnaireAnswersComponent', () => {
  let component: ShowQuestionnaireAnswersComponent;
  let fixture: ComponentFixture<ShowQuestionnaireAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowQuestionnaireAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowQuestionnaireAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
