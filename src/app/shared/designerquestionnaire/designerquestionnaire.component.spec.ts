import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerquestionnaireComponent } from './designerquestionnaire.component';

describe('DesignerquestionnaireComponent', () => {
  let component: DesignerquestionnaireComponent;
  let fixture: ComponentFixture<DesignerquestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerquestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerquestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
