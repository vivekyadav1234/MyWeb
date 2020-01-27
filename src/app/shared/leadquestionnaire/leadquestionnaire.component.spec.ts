import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadquestionnaireComponent } from './leadquestionnaire.component';

describe('LeadquestionnaireComponent', () => {
  let component: LeadquestionnaireComponent;
  let fixture: ComponentFixture<LeadquestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadquestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadquestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
